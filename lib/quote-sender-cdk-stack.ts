import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as events from '@aws-cdk/aws-events'
import * as targets from '@aws-cdk/aws-events-targets';
import fs = require('fs');
import path = require("path")

export class QuoteSenderCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'send-quote', {
      displayName: 'Quote4You '
    });
    
    const phonesubs = fs.readFileSync(path.resolve(__dirname, "../phone_subscriptions"), {encoding: 'utf-8'});
    
    // change limit to reflect how many of the subscriptions you want
    const smssubs = phonesubs.split('\n', 3);
    smssubs.map(sms => new subs.SmsSubscription(sms)).forEach(s => topic.addSubscription(s));
    
    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'quoteID', type: dynamodb.AttributeType.STRING}
    });

    const quoteSenderLambdaFile = fs.readFileSync(path.resolve(__dirname, "../lambda_code/lambda-handler.py"), { encoding: 'utf-8' });
    const quoteTableSynchronizerLambdaFile = fs.readFileSync(path.resolve(__dirname, "../lambda_code/quote-table-synchronizer.py"), { encoding: 'utf-8' });

    const quoteSenderLambda = new lambda.Function(this, 'QuoteSenderLambda', {
      code: new lambda.InlineCode(quoteSenderLambdaFile),
      handler: 'index.lambda_handler',
      timeout: cdk.Duration.seconds(300),
      runtime: lambda.Runtime.PYTHON_3_6,
      environment: {
        'sns_arn': topic.topicArn,
        'table_name': table.tableName
      }
    });

    const quoteTableSynchronizerLambda = new lambda.Function(this, 'QuoteTableSynchronizerLambda', {
      code: new lambda.InlineCode(quoteTableSynchronizerLambdaFile),
      handler: 'index.lambda_handler',
      timeout: cdk.Duration.seconds(300),
      runtime: lambda.Runtime.PYTHON_3_6,
      environment: {
        'table_name': table.tableName
      }
    });

    const ruleSend = new events.Rule(this, 'ScheduleRuleSend', {
      schedule: events.Schedule.cron({minute: '0'})
    });

    const ruleSynchronize = new events.Rule(this, 'ScheduleRuleSynchronize', {
      schedule: events.Schedule.cron({hour: '0'})
    });

    ruleSend.addTarget(new targets.LambdaFunction(quoteSenderLambda));
    topic.grantPublish(quoteSenderLambda);
    table.grantReadWriteData(quoteSenderLambda);

    ruleSynchronize.addTarget(new targets.LambdaFunction(quoteTableSynchronizerLambda));
    table.grantWriteData(quoteTableSynchronizerLambda);
  }
}
