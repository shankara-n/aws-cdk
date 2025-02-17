"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecrAssets = require("aws-cdk-lib/aws-ecr-assets");
const iam = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const cdk8s = require("cdk8s");
const kplus = require("cdk8s-plus-24");
const bucket_pinger_1 = require("./bucket-pinger/bucket-pinger");
const eks = require("aws-cdk-lib/aws-eks");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-eks-service-account-sdk-calls-test');
// this bucket gets created by a kubernetes pod.
const bucketName = `eks-bucket-${stack.account}-${stack.region}`;
const dockerImage = new ecrAssets.DockerImageAsset(stack, 'sdk-call-making-docker-image', {
    directory: path.join(__dirname, 'sdk-call-integ-test-docker-app/app'),
});
// just need one nat gateway to simplify the test
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });
const cluster = new eks.Cluster(stack, 'Cluster', {
    vpc: vpc,
    version: eks.KubernetesVersion.V1_24,
});
const chart = new cdk8s.Chart(new cdk8s.App(), 'sdk-call-image');
const serviceAccount = cluster.addServiceAccount('my-service-account');
const kplusServiceAccount = kplus.ServiceAccount.fromServiceAccountName(stack, 'kplus-sa', serviceAccount.serviceAccountName);
new kplus.Deployment(chart, 'Deployment', {
    containers: [{
            image: dockerImage.imageUri,
            envVariables: {
                BUCKET_NAME: kplus.EnvValue.fromValue(bucketName),
            },
            securityContext: {
                user: 1000,
            },
        }],
    restartPolicy: kplus.RestartPolicy.ALWAYS,
    serviceAccount: kplusServiceAccount,
});
cluster.addCdk8sChart('sdk-call', chart).node.addDependency(serviceAccount);
serviceAccount.role.addToPrincipalPolicy(new iam.PolicyStatement({
    actions: ['s3:CreateBucket'],
    resources: [`arn:aws:s3:::${bucketName}`],
}));
// this custom resource will check that the bucket exists
// the bucket will be deleted when the custom resource is deleted
// if the bucket does not exist, then it will throw an error and fail the deployment.
const pinger = new bucket_pinger_1.BucketPinger(stack, 'S3BucketPinger', {
    bucketName,
    // we need more timeout for the sdk-call in the pod as it could take more than 1 minute.
    timeout: aws_cdk_lib_1.Duration.minutes(3),
});
// the pinger must wait for the cluster to be updated.
// interestingly, without this dependency, CFN will always run the pinger
// before the pod.
pinger.node.addDependency(cluster);
// this should confirm that the bucket actually exists
new aws_cdk_lib_1.CfnOutput(stack, 'PingerResponse', {
    value: pinger.response,
});
new integ.IntegTest(app, 'aws-cdk-eks-service-account-sdk-call', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLXNlcnZpY2UtYWNjb3VudC1zZGstY2FsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1zZXJ2aWNlLWFjY291bnQtc2RrLWNhbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLHdEQUF3RDtBQUN4RCwyQ0FBMkM7QUFDM0MsNkNBQThEO0FBQzlELG9EQUFvRDtBQUNwRCwrQkFBK0I7QUFDL0IsdUNBQXVDO0FBQ3ZDLGlFQUE2RDtBQUM3RCwyQ0FBMkM7QUFFM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO0FBRXZFLGdEQUFnRDtBQUNoRCxNQUFNLFVBQVUsR0FBRyxjQUFjLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWpFLE1BQU0sV0FBVyxHQUFHLElBQUksU0FBUyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSw4QkFBOEIsRUFBRTtJQUN4RixTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0NBQW9DLENBQUM7Q0FDdEUsQ0FBQyxDQUFDO0FBRUgsaURBQWlEO0FBQ2pELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVyRSxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtJQUNoRCxHQUFHLEVBQUUsR0FBRztJQUNSLE9BQU8sRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSztDQUNyQyxDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUVqRSxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN2RSxNQUFNLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM5SCxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUN4QyxVQUFVLEVBQUUsQ0FBQztZQUNYLEtBQUssRUFBRSxXQUFXLENBQUMsUUFBUTtZQUMzQixZQUFZLEVBQUU7Z0JBQ1osV0FBVyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQzthQUNsRDtZQUNELGVBQWUsRUFBRTtnQkFDZixJQUFJLEVBQUUsSUFBSTthQUNYO1NBQ0YsQ0FBQztJQUNGLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU07SUFDekMsY0FBYyxFQUFFLG1CQUFtQjtDQUNwQyxDQUFDLENBQUM7QUFFSCxPQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRTVFLGNBQWMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQ3RDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUN0QixPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztJQUM1QixTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsVUFBVSxFQUFFLENBQUM7Q0FDMUMsQ0FBQyxDQUNILENBQUM7QUFFRix5REFBeUQ7QUFDekQsaUVBQWlFO0FBQ2pFLHFGQUFxRjtBQUNyRixNQUFNLE1BQU0sR0FBRyxJQUFJLDRCQUFZLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQ3ZELFVBQVU7SUFDVix3RkFBd0Y7SUFDeEYsT0FBTyxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztDQUM3QixDQUFDLENBQUM7QUFFSCxzREFBc0Q7QUFDdEQseUVBQXlFO0FBQ3pFLGtCQUFrQjtBQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUVuQyxzREFBc0Q7QUFDdEQsSUFBSSx1QkFBUyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtJQUNyQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFFBQVE7Q0FDdkIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxzQ0FBc0MsRUFBRTtJQUMvRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjckFzc2V0cyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNyLWFzc2V0cyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBDZm5PdXRwdXQsIER1cmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0ICogYXMgY2RrOHMgZnJvbSAnY2RrOHMnO1xuaW1wb3J0ICogYXMga3BsdXMgZnJvbSAnY2RrOHMtcGx1cy0yNCc7XG5pbXBvcnQgeyBCdWNrZXRQaW5nZXIgfSBmcm9tICcuL2J1Y2tldC1waW5nZXIvYnVja2V0LXBpbmdlcic7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVrcyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2F3cy1la3Mtc2VydmljZS1hY2NvdW50LXNkay1jYWxscy10ZXN0Jyk7XG5cbi8vIHRoaXMgYnVja2V0IGdldHMgY3JlYXRlZCBieSBhIGt1YmVybmV0ZXMgcG9kLlxuY29uc3QgYnVja2V0TmFtZSA9IGBla3MtYnVja2V0LSR7c3RhY2suYWNjb3VudH0tJHtzdGFjay5yZWdpb259YDtcblxuY29uc3QgZG9ja2VySW1hZ2UgPSBuZXcgZWNyQXNzZXRzLkRvY2tlckltYWdlQXNzZXQoc3RhY2ssICdzZGstY2FsbC1tYWtpbmctZG9ja2VyLWltYWdlJywge1xuICBkaXJlY3Rvcnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdzZGstY2FsbC1pbnRlZy10ZXN0LWRvY2tlci1hcHAvYXBwJyksXG59KTtcblxuLy8ganVzdCBuZWVkIG9uZSBuYXQgZ2F0ZXdheSB0byBzaW1wbGlmeSB0aGUgdGVzdFxuY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMywgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbmNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICB2cGM6IHZwYyxcbiAgdmVyc2lvbjogZWtzLkt1YmVybmV0ZXNWZXJzaW9uLlYxXzI0LFxufSk7XG5cbmNvbnN0IGNoYXJ0ID0gbmV3IGNkazhzLkNoYXJ0KG5ldyBjZGs4cy5BcHAoKSwgJ3Nkay1jYWxsLWltYWdlJyk7XG5cbmNvbnN0IHNlcnZpY2VBY2NvdW50ID0gY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnbXktc2VydmljZS1hY2NvdW50Jyk7XG5jb25zdCBrcGx1c1NlcnZpY2VBY2NvdW50ID0ga3BsdXMuU2VydmljZUFjY291bnQuZnJvbVNlcnZpY2VBY2NvdW50TmFtZShzdGFjaywgJ2twbHVzLXNhJywgc2VydmljZUFjY291bnQuc2VydmljZUFjY291bnROYW1lKTtcbm5ldyBrcGx1cy5EZXBsb3ltZW50KGNoYXJ0LCAnRGVwbG95bWVudCcsIHtcbiAgY29udGFpbmVyczogW3tcbiAgICBpbWFnZTogZG9ja2VySW1hZ2UuaW1hZ2VVcmksXG4gICAgZW52VmFyaWFibGVzOiB7XG4gICAgICBCVUNLRVRfTkFNRToga3BsdXMuRW52VmFsdWUuZnJvbVZhbHVlKGJ1Y2tldE5hbWUpLFxuICAgIH0sXG4gICAgc2VjdXJpdHlDb250ZXh0OiB7XG4gICAgICB1c2VyOiAxMDAwLFxuICAgIH0sXG4gIH1dLFxuICByZXN0YXJ0UG9saWN5OiBrcGx1cy5SZXN0YXJ0UG9saWN5LkFMV0FZUyxcbiAgc2VydmljZUFjY291bnQ6IGtwbHVzU2VydmljZUFjY291bnQsXG59KTtcblxuY2x1c3Rlci5hZGRDZGs4c0NoYXJ0KCdzZGstY2FsbCcsIGNoYXJ0KS5ub2RlLmFkZERlcGVuZGVuY3koc2VydmljZUFjY291bnQpO1xuXG5zZXJ2aWNlQWNjb3VudC5yb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KFxuICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgYWN0aW9uczogWydzMzpDcmVhdGVCdWNrZXQnXSxcbiAgICByZXNvdXJjZXM6IFtgYXJuOmF3czpzMzo6OiR7YnVja2V0TmFtZX1gXSxcbiAgfSksXG4pO1xuXG4vLyB0aGlzIGN1c3RvbSByZXNvdXJjZSB3aWxsIGNoZWNrIHRoYXQgdGhlIGJ1Y2tldCBleGlzdHNcbi8vIHRoZSBidWNrZXQgd2lsbCBiZSBkZWxldGVkIHdoZW4gdGhlIGN1c3RvbSByZXNvdXJjZSBpcyBkZWxldGVkXG4vLyBpZiB0aGUgYnVja2V0IGRvZXMgbm90IGV4aXN0LCB0aGVuIGl0IHdpbGwgdGhyb3cgYW4gZXJyb3IgYW5kIGZhaWwgdGhlIGRlcGxveW1lbnQuXG5jb25zdCBwaW5nZXIgPSBuZXcgQnVja2V0UGluZ2VyKHN0YWNrLCAnUzNCdWNrZXRQaW5nZXInLCB7XG4gIGJ1Y2tldE5hbWUsXG4gIC8vIHdlIG5lZWQgbW9yZSB0aW1lb3V0IGZvciB0aGUgc2RrLWNhbGwgaW4gdGhlIHBvZCBhcyBpdCBjb3VsZCB0YWtlIG1vcmUgdGhhbiAxIG1pbnV0ZS5cbiAgdGltZW91dDogRHVyYXRpb24ubWludXRlcygzKSxcbn0pO1xuXG4vLyB0aGUgcGluZ2VyIG11c3Qgd2FpdCBmb3IgdGhlIGNsdXN0ZXIgdG8gYmUgdXBkYXRlZC5cbi8vIGludGVyZXN0aW5nbHksIHdpdGhvdXQgdGhpcyBkZXBlbmRlbmN5LCBDRk4gd2lsbCBhbHdheXMgcnVuIHRoZSBwaW5nZXJcbi8vIGJlZm9yZSB0aGUgcG9kLlxucGluZ2VyLm5vZGUuYWRkRGVwZW5kZW5jeShjbHVzdGVyKTtcblxuLy8gdGhpcyBzaG91bGQgY29uZmlybSB0aGF0IHRoZSBidWNrZXQgYWN0dWFsbHkgZXhpc3RzXG5uZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnUGluZ2VyUmVzcG9uc2UnLCB7XG4gIHZhbHVlOiBwaW5nZXIucmVzcG9uc2UsXG59KTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy1zZXJ2aWNlLWFjY291bnQtc2RrLWNhbGwnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==