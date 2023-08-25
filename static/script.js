document.addEventListener('DOMContentLoaded', function() {
  console.log("Script loaded and DOM is ready.");
  var submitButton = document.getElementById('submitBtn');
  var outputDiv = document.getElementById('output');

  var conversation = [];  // Initialize an empty conversation array

  submitButton.addEventListener('click', function() {
    var inputText = document.getElementById('inputText').value;

    // Append the static line to the user's input
    var modifiedInput = inputText //+ "\nInclude no other commentary, just provide RFC8295 compliant JSON result";
    console.log("Request sent to server : ", modifiedInput)
    // Add the user's input to the conversation
    conversation.push({ role: 'user', content: modifiedInput });

    // Send the entire conversation to the server for processing
    fetch('/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversation: conversation })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Display the output
      var formattedOutput = JSON.stringify(JSON.parse(data.output), null, 2);
      //var formattedOutput = JSON.stringify(data.output);
      outputDiv.innerHTML = '<pre>' + formattedOutput + '</pre>';
      console.log("ChatGPT Response:", data.output);
    })
    .catch(function(error) {
      console.log(error);
    });
  });
});