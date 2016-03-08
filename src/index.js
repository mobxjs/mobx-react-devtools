import React from 'react';

const DevTools = (typeof window !== "undefined" && typeof document !== "undefined"
   ? require('./devtools').default
   : React.createClass({
       displayName: "DevTools",
       render: function() {
           return null;
       }
   })
);

export default DevTools;