# Example Reverse Proxy

Example reverse proxy for local development with the BloomReach Experience Angular SDK.  
Based on [Woonsan Ko's reverse proxy script for Node](https://github.com/woonsan/hippo7-rproxy-nodejs).

## Install and run reverse proxy

Make sure that Node and NPM is installed. To install and run the reverse proxy, run:

```bash
npm install
sudo node rproxy
```

If no additional parameters are provided, the reverse proxy will run on the default port 
80. On most systems you need superuser privileges to be able to run on port 80, which is
why `sudo` is used.

## Update hosts configuration

Update your hosts configuration with the right CMS URLs and CORS headers. If you're using
the standard demo project, you can use the YAML code below to replace the current 
hst:hosts configuration.

### Update existing hosts configuration

The instructions below assume default local development hosts configuration with the Page Model API enabled.

* Go to the CMS console and navigate to [/hst:hst/hst:hosts/dev-localhost/localhost/hst:root](http://localhost:8080/cms/console/?1&path=/hst:hst/hst:hosts/dev-localhost/localhost/hst:root)
  * Add the property `hst:responseheaders` with values:
    * `Access-Control-Allow-Origin: http://localhost:4200`
    * `Access-Control-Allow-Credentials: true`
* Navigate to [/hst:hst/hst:hosts/dev-localhost](http://localhost:8080/cms/console/?1&path=/hst:hst/hst:hosts/dev-localhost)
  * Copy the node `dev-localhost` to `/hst:hst/hst:hosts` and name the new node       
    `dev-localhost-proxy`
* Navigate to the just created node [/hst:hst/hst:hosts/dev-localhost-proxy](http://localhost:8080/cms/console/?1&path=/hst:hst/hst:hosts/dev-localhost-proxy)
  * Change the property `hst:cmslocation` to `http://localhost/cms`
  * Remove the property `hst:defaultport`
  * Navigate to the subnode `hst:root` which should be at [/hst:hst/hst:hosts/dev-localhost-proxy/1/0/0/127/hst:root](http://localhost:8080/cms/console/?1&path=/hst:hst/hst:hosts/dev-localhost-proxy/1/0/0/127/hst:root)
  * Change the first value of property `hst:responseheaders` to 
    `Access-Control-Allow-Origin: http://localhost`
* Don't forget to Write changes to repository

### Replace existing hosts configuration - YAML export of /hst:hosts for demo project

```yaml
/hst:hosts:
  jcr:primaryType: hst:virtualhosts
  hst:defaultcontextpath: /site
  /dev-localhost:
    jcr:primaryType: hst:virtualhostgroup
    hst:cmslocation: http://localhost/cms
    /localhost:
      jcr:primaryType: hst:virtualhost
      /hst:root:
        jcr:primaryType: hst:mount
        hst:homepage: root
        hst:mountpoint: /hst:hst/hst:sites/myhippoproject
        hst:pagemodelapi: resourceapi
        hst:responseheaders: ['Access-Control-Allow-Origin: http://localhost:4200',
          'Access-Control-Allow-Credentials: true']
  /dev-localhost-proxy:
    jcr:primaryType: hst:virtualhostgroup
    hst:cmslocation: http://127.0.0.1/cms
    /1:
      jcr:primaryType: hst:virtualhost
      /0:
        jcr:primaryType: hst:virtualhost
        /0:
          jcr:primaryType: hst:virtualhost
          /127:
            jcr:primaryType: hst:virtualhost
            /hst:root:
              jcr:primaryType: hst:mount
              hst:homepage: root
              hst:mountpoint: /hst:hst/hst:sites/myhippoproject
              hst:pagemodelapi: resourceapi
              hst:responseheaders: ['Access-Control-Allow-Origin: http://127.0.0.1',
                'Access-Control-Allow-Credentials: true']
```

## Update API Urls in Angular app

Update the API URls in the Angular app to point to the reverse proxy when in preview (for 
the demo app this is defined in `src/app/bre-page-demo/bre-page-demo.component.ts`):

```typescript
apiUrls = {
  live: {},
  preview: {
    hostname: '127.0.0.1',
    port: 80
  }
};
```

Now you should be able to access the live app at the usual URL <http://localhost:4200> and
the CMS at <http://127.0.0.1/cms>. Please note the CMS hostname should be 127.0.0.1 and 
not localhost so that the right hosts configuration is used.
