"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const appsync = require("aws-cdk-lib/aws-appsync");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');
const api = new appsync.GraphqlApi(stack, 'NoneAPI', {
    name: 'NoneAPI',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.none.graphql')),
});
api.addNoneDataSource('NoneDS', {
    name: cdk.Lazy.string({ produce() { return 'NoneDS'; } }),
});
new integ_tests_alpha_1.IntegTest(app, 'api', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXBwc3luYy1ub25lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXBwc3luYy1ub25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG1DQUFtQztBQUNuQyxrRUFBdUQ7QUFDdkQsbURBQW1EO0FBRW5ELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7SUFDbkQsSUFBSSxFQUFFLFNBQVM7SUFDZixNQUFNLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztDQUNuRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFO0lBQzlCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sS0FBYSxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0NBQ2xFLENBQUMsQ0FBQztBQUVILElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0lBQ3hCLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwcHN5bmMnO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3N0YWNrJyk7XG5cbmNvbnN0IGFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkoc3RhY2ssICdOb25lQVBJJywge1xuICBuYW1lOiAnTm9uZUFQSScsXG4gIHNjaGVtYTogYXBwc3luYy5TY2hlbWFGaWxlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXBwc3luYy5ub25lLmdyYXBocWwnKSksXG59KTtcblxuYXBpLmFkZE5vbmVEYXRhU291cmNlKCdOb25lRFMnLCB7XG4gIG5hbWU6IGNkay5MYXp5LnN0cmluZyh7IHByb2R1Y2UoKTogc3RyaW5nIHsgcmV0dXJuICdOb25lRFMnOyB9IH0pLFxufSk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnYXBpJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7Il19