# BinaryVisionariesHack

How to Execute

1. Download or clone the code
   
2. Install Flask to run the server :: pip install flask

3. Generate an API key on OpenAi : https://platform.openai.com/account/api-keys  

4. Edit server.py file with the OpenAI API key. 
    1. The line of code is available under def process_openai_script(conversation, behavior):
    2. Either add the API key as string, or store it in the environment variables.
    3. If you are storing in OS, replace "OPENAI_API_KEY_TEST2" with name of your key identifier 
          openai.api_key = os.getenv("Name of your KEY")
    4. If adding the key as STRING, replace the openai.api_key = os.getenv("OPENAI_API_KEY_TEST2") with
          openai.api_key = "Your API KEY"

5. In Terminal or CMD, Go to the directory and run the server, using this command : 
    python server.py

6. Open Browser and open : http://127.0.0.1:5000

7. Select the use case "Test Data Creation" and create data as you need

8. Other usecases might not work as expected until the test data is created first

    
