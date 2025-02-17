"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("aws-cdk-lib");
const inc = require("aws-cdk-lib/cloudformation-include");
const app = new core.App();
const stack = new core.Stack(app, 'ParentStack');
new inc.CfnInclude(stack, 'ParentStack', {
    templateFile: 'test-templates/nested/parent-one-child.json',
    loadNestedStacks: {
        ChildStack: {
            templateFile: 'test-templates/nested/grandchild-import-stack.json',
        },
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubmVzdGVkLXN0YWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm5lc3RlZC1zdGFja3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FBb0M7QUFDcEMsMERBQTBEO0FBRTFELE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTNCLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFFakQsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7SUFDdkMsWUFBWSxFQUFFLDZDQUE2QztJQUMzRCxnQkFBZ0IsRUFBRTtRQUNoQixVQUFVLEVBQUU7WUFDVixZQUFZLEVBQUUsb0RBQW9EO1NBQ25FO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb3JlIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGluYyBmcm9tICdhd3MtY2RrLWxpYi9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlJztcblxuY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnUGFyZW50U3RhY2snKTtcblxubmV3IGluYy5DZm5JbmNsdWRlKHN0YWNrLCAnUGFyZW50U3RhY2snLCB7XG4gIHRlbXBsYXRlRmlsZTogJ3Rlc3QtdGVtcGxhdGVzL25lc3RlZC9wYXJlbnQtb25lLWNoaWxkLmpzb24nLFxuICBsb2FkTmVzdGVkU3RhY2tzOiB7XG4gICAgQ2hpbGRTdGFjazoge1xuICAgICAgdGVtcGxhdGVGaWxlOiAndGVzdC10ZW1wbGF0ZXMvbmVzdGVkL2dyYW5kY2hpbGQtaW1wb3J0LXN0YWNrLmpzb24nLFxuICAgIH0sXG4gIH0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=