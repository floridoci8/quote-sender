# Welcome to the Quote-Sender Project!

This project utilizes AWS to send a random quote from a predetermined list of quotes every hour to your friends' phones via SMS. 

You will need an **AWS account**. 

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

```
$ npm run build
```

 * Put the phone numbers you wish to send these quotes to in the document named *`phone_subscriptions`* in the main directory of your stack. **Make sure to put every phone number in a separate line**.

 * Install the used libraries.
```
$ npm install
```

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
