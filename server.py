import re
from flask import Flask, request, jsonify, render_template

app = Flask(__name__, static_url_path='/static')

@app.route('/openai', methods=['POST'])
def openai():
    # Retrieve the conversation history from the request
    conversation = request.json['conversation']
    behavior = request.json['behavior']
    #print(f'Request to ChatGPT :  + {conversation}')


    # Process the conversation using OpenAI Python script
    output_text = process_openai_script(conversation, behavior)

    # Return the output as JSON
    return jsonify({'output': output_text})

def process_openai_script(conversation, behavior):
    # Write your OpenAI Python script here
    # This function should handle the OpenAI script execution and return the output

    import os
    import openai

    openai.api_key = os.getenv("OPENAI_API_KEY_TEST2")

    # Create a list of messages from the conversation
    #"You are a Test Data Manager for a Bank, providing accounts for UAT testing"
    messages = [{"role": "system", "content": behavior}]  
    for message in conversation:
        messages.append(message)

    completion = openai.ChatCompletion.create(
      model="gpt-3.5-turbo-16k-0613",
      messages=messages,
      temperature=0.9      
    )

    chat_response = completion.choices[0].message.content
    print(f'Chat GPT behavior: {behavior}')
    print(f'Chat GPT Response: {chat_response}')
    messages.append({"role": "assistant", "content": chat_response})

    # Use regex to extract the JSON content
    json_match = re.search(r'```json(.*?)```', chat_response, re.DOTALL)
    if json_match:
        extracted_json = json_match.group(1)
        print("Extracted JSON:", extracted_json)
        chat_response = extracted_json
    else:
        print("No JSON content found in the response")

    # Example code to mimic OpenAI processing
    output_text = chat_response
    #output_text = extracted_json

    return output_text

@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True)
