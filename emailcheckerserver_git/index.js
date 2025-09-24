
const ghost = "mail.yourhostname.com"; //Your host here
const gusername = "yourusername@hostname.com"; //Your username here
const gpass = "yourpassword"; //Your password here

console.log("EmailReader: Server Module loaded"); 

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, maxPayload: 1048576 });

const { ImapFlow } = require( 'imapflow' );
const mailparser = require('mailparser').simpleParser;


wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {		  
    console.log('received: %s', message);
    
    if(message.includes("getemails"))	
    {
    const indexstart = message.indexOf("_");
    var numemails =  message.toString().substring(indexstart+1);  
    sendemailstoclient(ws,numemails);	  
     }
    	  
    });

    //ws.send('STARTUPMESSAGE');
});

//start our server
server.listen(3000, () => {
    console.log(`Server started on port ${server.address().port}`);
});

async function sendemailstoclient(ws,numemails)
{    
	  const result = await fetchEmails(numemails);
	   if (result?.system?.length) {
            console.log(result.system.join('\n---\n')); // Fixed join syntax
            ws.send(result.system.join('\n---\n'));
        } 
}
	
async function fetchEmails(numemails) {

    console.log("numemails:" + numemails);

    const client = new ImapFlow({
        host: ghost,//'YOURHOST',
        port: 143,
        secure: false,
        auth: {
            user: gusername,//'YOUREMAIL',
            pass: gpass//'YOURPASSWORD'
        },
        logger: false // Disable verbose logging
    });

    try {
        await client.connect();
        const lock = await client.getMailboxLock('INBOX');
        let messages = [];

        try {
            // Fetch last 10 message envelopes
            	 	//let count = Math.min(client.mailbox.exists, 10);
			let count = Math.min(client.mailbox.exists, numemails);//2 1
            let start = client.mailbox.exists - count + 1;
            let sequence = `${start}:${client.mailbox.exists}`;

            for await (let message of client.fetch(sequence, {
                envelope: true,
                source: true
            })) {
							
			const bodystring = message.source.toString('utf8');
			const mail = await mailparser(bodystring);
			const mailtest = mail.text;
			var mailtest2 = mailtest.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
			mailtest2 = mailtest2.replaceAll("||","");
				
                messages.push({
                    //id: message.uid,
                    from: message.envelope.from[0].address,
                    subject: message.envelope.subject || '(No Subject)',
                    date: message.envelope.date.toISOString(),
		    body: mailtest2										
                });
            }
        } 
		
		finally {
            lock.release();
            await client.logout();
        }

        // Format for SillyTavern system messages
        return {
			    system: messages.map(msg =>
              //  `EMAIL \n From: ${msg.from}\n` +
                `From: ${msg.from}\n` +
                `Subject: ${msg.subject}\n` +
                `Date: ${msg.date}\n` +
		`Body: ${msg.body || 'No body content'}\n`  // ADDED body field!
            )			
        };
    } 
		
catch (err) {
    // Detailed error logging
    const errorDetails = {
        timestamp: new Date().toISOString(),
        error: {
            name: err.name,
            message: err.message,
            code: err.code,
            stack: err.stack
        },
        connection: {
            host: client.options.host,
            port: client.options.port,
            user: client.options.auth.user
        }
    };

console.log(JSON.stringify(errorDetails, null, 2));

    return {
        system: [
            'Email Error: Failed to retrieve messages',
            `Technical Details: ${err.message}`
        ]
    };
}	
}	
