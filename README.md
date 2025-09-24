
ST-EmailChecker is a simple client/server extension for SillyTavern that allows an LLM to connect to a user's inbox and download the most recent emails to the LLM.

The emails are stripped of HTML and hyperlinks (Only the message body is returned) and the emails are added to the LLM as "reasoning" (Using reasoning-set). This prevents large blocks of text from spamming the chat window.

The purpose of this extension is to allow an LLM to function as a digital assistant/secretary, checking for important emails, drafting replies, summarising, etc, etc.

In the future, I may add the ability to search for specific strings in emails, or for emails from specific people, search for only unread emails, etc. 

If the emails appear to be truncated in SillyTavern, make sure that your "Response (Tokens)" is set high enough in AI response configuration.

---

Usage:

Download the code.

You should have two folders:

emailcheckerserver_git  
emailcheckerclient_git

Place BOTH of these folders in your SillyTavern/data/default-user/extensions/ directory.

Open the folder "emailcheckerserver_git".

At the top of the script, you will need to set the hostname, username, and password for your email account.

Now, run:

Node index.js in a command window.

You may need to run:

npm install imapflow

When successful, you should see:

EmailReader: Server Module Loaded
Server started on port 3000

Finally, in "emailcheckerclient_git", set the IP address of your server at the top of the script.

If you are running sillytavenr locally, you do not need to do anything.

However, if you are connecting to a LAN server, enter the IP of the server in this script (Without the port).

The client will show up as an extension in sillytavern as "Email Checker". 

To use, simply click on the down arrow next to "Email Checker", set the number of emails you wish to return, and click "Run Email Check".

For any questions or comments, I can be contacted at:

contact@phoenixgamedevelopment.com.



