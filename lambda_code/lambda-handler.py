import json
import boto3
import random 
import os
import urllib
import hashlib 
import uuid
from boto3.dynamodb.conditions import Attr

targetArn = os.environ['sns_arn']
tableName = os.environ['table_name']

# link DynamoDB
ddb = boto3.resource('dynamodb')
table = ddb.Table(tableName)

snsClient = boto3.client('sns')

def lambda_handler(event, context):

    # read all the table to get the quotes.
    response = table.scan(
        FilterExpression=Attr('sent').eq(False)
    )

    myquotes = response.get('Items', [])
    hourlyQuote = random.choice(myquotes)

    response = table.update_item(
        Key={
            'quoteID' : hourlyQuote['quoteID']
        },
        UpdateExpression="set sent=:s",
        ExpressionAttributeValues={
            ':s': True
        }
    )

    random_quote = hourlyQuote['quote']
    random_author = hourlyQuote['author']
    
    hmessage = "\"" + random_quote + "\"" + "\n - " + random_author
    
    print(hmessage)
    
    snsClient.publish(TargetArn=targetArn, Message=hmessage, MessageStructure='text')
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }