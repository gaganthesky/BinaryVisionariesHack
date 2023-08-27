document.addEventListener('DOMContentLoaded', function() {
  console.log("Script loaded and DOM is ready.");
  var submitButton = document.getElementById('submitBtn');
  var outputDiv = document.getElementById('TestDataOutput');
  var aioutputDiv = document.getElementById('AIOutput');
  var tokenUsedDIV = document.getElementById('TokenUsedDIV');
  var homeBtn = document.getElementById('homeBtn');
  var backBtn = document.getElementById('backBtn');
  var useCaseDropdown = document.getElementById('useCaseDropdown');
  var role = 'user';
  var behavior = 'You are a Test Data Manager for a Bank, providing accounts for UAT testing, the output should always be in JSON format';
  var testDataRoleTag = true;
  var aioutputDivFlag = false;
  
  var copyTestDataButton = document.getElementById('copyTestDataBtn'); // Get the copy button

  var predefinedStringCheckbox = document.getElementById('predefinedStringCheckbox');
  var count = 0;

  var defaultJSONPrompt = ".\nWhen you respond to me, do not give commentary. Please make your entire response a valid JSON object with valid JSON formatting and syntax.";//"\nInclude no other commentary, just provide RFC8295 compliant JSON result";
  var jsonStructure3 = "{ \"accounts\": [ { \"name\": string, \"accountId\": string, \"phoneNumber\": string, \"creditCards\": [ { \"creditCardNumber\": string, \"availableCreditLimit\": number, \"totalCreditLimit\": number } ], \"checkingAccounts\": [ { \"accountNumber\": string, \"balance\": number } ], \"address\": { \"line1\": string, \"line2\": string, \"city\": string, \"state\": string, \"zipCode\": string }, \"email\": string } ] }";
  var ask = ".\nWhen you respond to me, do not give commentary. Make your entire response a valid syntax JSON object, an array of accounts. Please provide the accounts in the following JSON key/value structure. : " + jsonStructure3;

   // Handle the Home button
  homeBtn.addEventListener('click', function() {
    window.location.href = '/';
  });

  // Handle the Back button
  backBtn.addEventListener('click', function() {
    window.history.back();
  });

  // Handle the Copy button click
    copyTestDataButton.addEventListener('click', function() {
      var range = document.createRange();
      range.selectNode(outputDiv);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeRange(range);
      alert("Content copied to clipboard!");
    });

  // Handle the dropdown selection and modify the behavior
    useCaseDropdown.addEventListener('change', function() {

    var selectedUseCase = useCaseDropdown.value;
    switch (selectedUseCase) {
      case 'TestDataCreation':
        behavior ='You are a Test Data Manager for a Bank, providing accounts for UAT testing, the output should always be in JSON format'
        role = 'assistant';
        testDataRoleTag = true;
        aioutputDivFlag = false;
        break;
      case 'DetermineEligibility':
        behavior = 'You are the business team for a Bank running the offers for customers, based on their profile and account history'
        role = 'user';
        testDataRoleTag = true;
        aioutputDivFlag = false;
        break;
      case 'CustomerServiceIVR':
        behavior = 'You are the customer service agent for BinaryBank, responding to customer based on their Account information. Start the conversation with a greeting, asking Name and Account Number'
        role = 'assistant';
        testDataRoleTag = false;
        aioutputDivFlag = true;
        break;
      case 'CheckPasswordSecurity':
        behavior = 'You are a security bot, providing feedback to the customers on their password strength, based on the provided customer data. The password is considered weak if it is the combination of any information that can be easily available to anyone trying to guess the password, like a combination of day month or year of birth, or a combination of letters in name and address. You have to respond back with the strenght of the password, in terms weak, strong, very strong, along with a reason'
        role = 'user';
        testDataRoleTag = false;
        aioutputDivFlag = true;
        break;
      // Add more cases for other use cases
      default:
        behavior = '';
        testDataRoleTag = true;
        aioutputDiv = false;
        break;
    }
  });


  var conversation = [];  // Initialize an empty conversation array

  submitButton.addEventListener('click', function() {

    var content;

    var inputText = document.getElementById('inputText').value;
    
    // Append the static line to the user's input
    var modifiedInput = inputText;
    if(count == 0 && predefinedStringCheckbox.checked){
      modifiedInput = inputText + ask; 
      count++;
    }
    else{
      modifiedInput = inputText + defaultJSONPrompt;
    }
    

    if(testDataRoleTag){
      content = modifiedInput;
    }
    else{
      content = inputText;
    }

    if(!aioutputDivFlag){
      console.log("I am resetting the aioutputDiv");
      aioutputDiv.innerHTML = '';
    }


    console.log("Request sent to server : ", content)
    // Add the user's input to the conversation
    conversation.push({ role: role, content: content });

    // Send the entire conversation to the server for processing
    fetch('/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversation: conversation, behavior: behavior })
    })
    .then(function(response) {
      //console.log("Response Headers : ", response.headers);
      return response.json();
    })
    .then(function(data) {

      if(testDataRoleTag){
              try{
                var formattedOutput = JSON.stringify(JSON.parse(data.output), null, 2);
                outputDiv.innerHTML = '<pre>' + formattedOutput + '</pre>';
                
              }
            catch {
                outputDiv.innerHTML = data.output;  
              }

      }
      else{
        aioutputDiv.innerHTML = data.output;  
      }


      conversation.push({ role: role, content: data.output });
      console.log("ChatGPT Response:", data.output);
    })
    .catch(function(error) {
      console.log(error);   

    });


  });
});