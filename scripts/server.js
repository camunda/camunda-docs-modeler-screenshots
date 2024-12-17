const express = require('express');
const app = express();
const port = 8080;

let server;

app.get('/engine-rest/deployment', (req, res) => {
  res.json([]);
});

app.post('/engine-rest/deployment/create', (req, res) => {
  res.json(
    { 'links': [ { 'method':'GET','href':'http://localhost:8080/engine-rest/deployment/db0856c8-40d2-11ed-a76b-0242b8ce6315','rel':'self' } ],'id':'db0856c8-40d2-11ed-a76b-0242b8ce6315','name':'Payment Retrieval','source':'Camunda Modeler','deploymentTime':'2022-09-30T17:16:28.022+0200','tenantId':null,'deployedProcessDefinitions':{ 'payment-retrival:1:db1f131a-40d2-11ed-a76b-0242b8ce6315':{ 'id':'payment-retrival:1:db1f131a-40d2-11ed-a76b-0242b8ce6315','key':'payment-retrival','category':'http://bpmn.io/schema/bpmn','description':null,'name':'Payment Retrival','version':1,'resource':'step1.3.bpmn','deploymentId':'db0856c8-40d2-11ed-a76b-0242b8ce6315','diagram':null,'suspended':false,'tenantId':null,'versionTag':null,'historyTimeToLive':null,'startableInTasklist':true } },'deployedCaseDefinitions':null,'deployedDecisionDefinitions':null,'deployedDecisionRequirementsDefinitions':null }
  );
});

app.get('/engine-rest/version', (req, res) => {
  res.json(
    { 'version': '7.18.0' }
  );
});

app.get('/shutdown', (req, res) => {
  res.send('OK');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});