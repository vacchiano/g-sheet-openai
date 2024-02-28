// Replace YOUR_API_KEY with your actual OpenAI API key !!!!!!
var OPENAI_API_KEY = 'YOUR_API_KEY';

function generateText(prompt) {
  var url = "https://api.openai.com/v1/completions";
  var payload = {
    "model": "gpt-3.5-turbo-instruct", // You can change the model based on your requirements
    "prompt": prompt,
    "temperature": 0.7,
    "max_tokens": 150
  };

  var options = {
    "method": "post",
    "headers": {
      "Authorization": "Bearer " + OPENAI_API_KEY,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true // Allows us to examine the error response
  };

  var response = UrlFetchApp.fetch(url, options);
  var responseCode = response.getResponseCode(); // Get the HTTP response code
  var jsonResponse = response.getContentText(); // Get the raw JSON response text

  if(responseCode !== 200) { // Check if the response code indicates an error
    // Log the error response for debugging
    Logger.log("API request failed with response code: " + responseCode + " and response: " + jsonResponse);
    return "API request failed. Response code: " + responseCode;
  }

  var data = JSON.parse(jsonResponse);

  if (!data.choices || data.choices.length === 0) {
    Logger.log("No choices available in the response: " + jsonResponse);
    return "No response data or empty choices array.";
  }

  return data.choices[0].text.trim();
}

/**
 * A custom function to use directly in your Google Sheet.
 * Usage in cell: =OPENAI("Your prompt here")
 */
function OPENAI(prompt) {
  if (!prompt) return "Please provide a prompt";
  try {
    var response = generateText(prompt);
    return response;
  } catch (e) {
    Logger.log("Error in generating text: " + e.toString());
    return "Error: " + e.toString();
  }
}
