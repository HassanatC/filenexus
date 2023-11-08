import boto3
from botocore.exceptions import NoCredentialsError
from botocore.client import Config
from django.conf import settings

def generate_presigned_url(bucket_name, object_name, expiration=3600):

    s3_client = boto3.client('s3', 
                             aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                             aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                             region_name='eu-west-2',
                             config=Config(signature_version='s3v4'))

    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
        
    except NoCredentialsError:
        print("Credentials not available")
        return None

    return response



