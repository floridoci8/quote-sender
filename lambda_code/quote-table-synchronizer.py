import json
import boto3
import os
import urllib
import hashlib 
from boto3.dynamodb.conditions import Attr

tableName = os.environ['table_name']

quotes_url = 'https://gist.githubusercontent.com/JoshFran/189f4d771e4ab13acabc95f1577c9ff2/raw/3b5fe8fc5340dc3f40cccfb0d22ce41fc9d6823e/100Quotes.json'

# link DynamoDB
ddb = boto3.resource('dynamodb')
table = ddb.Table(tableName)

def lambda_handler(event, context):
    # read json file from url
    webUrl = urllib.request.urlopen(quotes_url)
    data = webUrl.read()
    my_quotes = json.loads(data.decode("utf-8"))
    
    # iterate through list of dicts and push to database
    for i in my_quotes:
        quote = i['quote']
        author = i['author']
        
        # hash quote and author to make unique ID
        id = hashlib.sha1((quote+author).encode()).hexdigest()
        
        try:
            table.put_item(
                Item = {
                    'quoteID' : id,
                    'quote' : quote,
                    'author' : author,
                    'sent' : False
                },
                ConditionExpression=Attr('quoteID').not_exists()
            )
        except ddb.meta.client.exceptions.ConditionalCheckFailedException as e:
            print("quoteID {qid} already exists. Skipping entry.".format(qid = id)) 

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }