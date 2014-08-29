# Rest Methods

## Crud Methods

### insert / update / save behaviour

<table>
    <tr>
        <th>Method</th>
        <th>Request</th>
        <th>Object does not exists</th>
        <th>Object exists, and version matched</th>
        <th>Object exists, and version doesn't matched</th>
    </tr>    
    <tr>
        <td>get object</td>
        <td>
<pre><code>GET /db/{bucket}/{id}
Cache-Control: max-age=0, no-cache
If-None-Match: &quot;<i>version</i>&quot;</code></pre>        
        </td>      
        <td><b>404 Not Found</b><br> The object was not found, returns nothing.</td>
        <td><b>304 Not Modified</b><br> The object isn't changed, returns nothing.</td>
        <td><b>200 Ok</b><br> The requested object.</td>
    </tr> 
    <tr>
        <td>refresh object</td>
        <td>
<pre><code>GET /db/{bucket}/{id}
Cache-Control: max-age=0, no-cache</code></pre>        
        </td>                                                               
        <td><b>404 Not Found</b><br> The object was not found, returns nothing.</td>
        <td><b>200 Ok</b><br> The requested object.</td>
        <td><b>200 Ok</b><br> The requested object.</td>
    </tr>
    <tr>
        <td>insert / save new object</td>
        <td>
<pre><code>POST /db/{bucket}</code></pre>   
            <i>No additional header is required.</i>
        </td>
        <td><b>201 Created</b><br> Inserts the object and returns the inserted object.</td>
        <td><b>409 Conflict</b><br> Insert will be rejected.</td>
        <td><b>409 Conflict</b><br> Insert will be rejected.</td>
    </tr>
    <tr>
        <td>update / save existing object</td>
        <td>
<pre><code>PUT /db/{bucket}/{id}
If-Match: &quot;<i>version</i>&quot;</code></pre>        
        </td>                                                               
        <td><b>412 Precondition failed</b><br> Update will be rejected.</td>
        <td><b>200 Ok</b><br> Updates the object and returns the updated object.</td>
        <td><b>412 Precondition failed</b><br> Update will be rejected.</td>
    </tr>
    <tr>
        <td>update(force = true)</td>
        <td>
<pre><code>PUT /db/{bucket}/{id}
If-Match: *</code></pre>        
        </td>      
        <td><b>412 Precondition failed</b><br> Update will be rejected.</td>
        <td><b>200 Ok</b><br> Updates the object and returns the updated object.</td>
        <td><b>200 Ok</b><br> Overwrites the object and returns the updated object.</td>
    </tr>
    <tr>
        <td>save(force = true) insert or save an object</td>
        <td>
<pre><code>PUT /db/{bucket}/{id}</code></pre>   
            <i>No additional header is required.</i>
        </td>
        <td><b>200 Ok</b><br> Inserts the object and returns the inserted object.</td>
        <td><b>200 Ok</b><br> Updates the object and returns the updated object.</td>
        <td><b>200 Ok</b><br> Overwrites the object and returns the updated object.</td>
    </tr>
    <tr>
        <td>remove object</td>
        <td>
<pre><code>DELETE /db/{bucket}/{id}
If-Match: &quot;<i>version</i>&quot;</code></pre>        
        </td>                                                               
        <td><b>412 Precondition failed</b><br> Remove will be rejected.</td>
        <td><b>204 No Content</b><br> Removes the object and returns nothing.</td>
        <td><b>412 Precondition failed</b><br> Remove will be rejected.</td>
    </tr>
    <tr>
        <td>remove object</td>
        <td>
<pre><code>DELETE /db/{bucket}/{id}
If-Match: *</code></pre>        
        </td>      
        <td><b>412 Precondition failed</b><br> Remove will be rejected.</td>
        <td><b>204 No Content</b><br> Removes the object and returns nothing.</td>
        <td><b>204 No Content</b><br> Removes the object and returns nothing.</td>
    </tr>
    <tr>
        <td>remove object</td>
        <td>
<pre><code>DELETE /db/{bucket}/{id}</code></pre>   
            <i>No additional header is required.</i>
        </td>
        <td><b>204 No Content</b><br> Does nothing and returns nothing.</td>
        <td><b>204 No Content</b><br> Removes the object and returns nothing.</td>
        <td><b>204 No Content</b><br> Removes the object and returns nothing.</td>
    </tr>
</table>
    


