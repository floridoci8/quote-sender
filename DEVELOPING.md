# Making the Quote-Sender Project from Scratch

## Installation

(The following has been done in a Linux Ubuntu 20.04 system)

To be able to run this project and use **CDK** (CloudFormation Kit) to setup your environment in **AWS** you will need to install the following:

 * `node  + npm`

```
$ sudo apt update
$ sudo apt install nodejs npm
```

 * `typescript`

 ```
$ npm -g install typescript
 ```

 * `AWS CLI`
 
In your home or Downloads folder

```
$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
$ unzip awscliv2.zip
$ sudo ./aws/install
```

 * `CDK`

```
$ npm install -g aws-cdk
```
## Setup

 * Configure AWS credentials

```
$ aws configure
```
and enter the appropriate values for your AWS account

 * If you want to make the project from scratch then you can follow this [**TUTORIAL**](https://docs.aws.amazon.com/cdk/latest/guide/hello_world.html) to create your cdk stack. (I have chosen the language *typescript*)
 
 * Here are the relevant commands:
```
$ mkdir quote-sender-cdk
$ cd quote-sender-cdk
$ cdk init app --language typescript
$ npm run build
```
 * Put code in a directory next to lib, *`./lambda_code/`*

 * I have used two separate lambda files and put them in the same folder. I prefer to do it this way you can do it differently.

 * Make a document named *`phone_subscriptions`* in the main directory of your stack and fill it with the phone numbers you wish to send these quotes to. **Make sure to put every phone number in a separate line**.

 * After you have created the stack you can change the *`./lib/send-quotes-cdk-stack.ts`* (e.g. use my file) to make any other changes to the stack.

 * You have to install the used libraries beforoe importing them in the stack file.
```
$ npm install @aws-cdk/aws-sns
$ npm install @aws-cdk/aws-sns-subscriptions
$ npm install @aws-cdk/aws-lambda
$ npm install @aws-cdk/aws-dynamodb
$ npm install @aws-cdk/aws-events
$ npm install @aws-cdk/aws-events-targets
```

 * **NOTE**: Make sure that all the versions of these libraries are the same, or the program wil not work. If you have different versions (i.e. you install these libraries at different times), you will need to install them again.

## Deployment

 * After you are done setting up you can check the differences that will be made to the stack,
```
$ cdk diff
```
 * And deploy the changes.
```
$ cdk deploy
```
## Success

Should everything work correctly, your friends will receive a random quote in the first minute of every hour. :)

## Testing lambda from cli

**NOTE**: *`{my-function-name}`* in the lines below has to be replaced with the name of your lambda function that you see in the **AWS Console**, that will looks something like *`stackName-FunctionName12345678-A1C2EFGJ3IJKL`*

 ```
$ aws lambda invoke \
--function-name {my-function-name} \
--cli-binary-format raw-in-base64-out \
--payload '{ "name": "Bob" }' \
response.json
 ```

## Some Useful CDK Commands

*This section has been generated automatically by cdk.*

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 
The `cdk.json` file tells the CDK Toolkit how to execute your app.
