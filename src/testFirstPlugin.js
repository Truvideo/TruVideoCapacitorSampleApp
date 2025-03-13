import React from 'react'
// import {  Example} from 'first-plugin';

function testFirstPlugin() {
    async function testPlugin() {
        console.log("testFirstPlugin" , Example); 
        // try {
        //     const response = await MyPlugin.echo({ value: "Hello from plugin!" });
        //     console.log("Plugin Response:", response);
        // } catch (error) {
        //     console.error("Error using plugin:", error);
        // }
    }

    // testPlugin();
console.log("Component Called"); 
    return (
        <div>
            {/* {testPlugin()} */}
            <h1>testFirstPlugin</h1>
        </div>
    )
}

export default testFirstPlugin


