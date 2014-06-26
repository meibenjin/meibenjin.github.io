function load_disqus() {
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    var disqus_shortname = 'blogmbj';
    //var disqus_identifier = 'newid1';
    var disqus_url = 'http://www.meibenjin.cn/index.html';
    var disqus_config = function () { 
        this.language = "zh_cn";
    };

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
         var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
         dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
         (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
     })();

    /* * * Disqus Reset Function * * */
    var reset = function (newIdentifier, newUrl, newTitle, newLanguage) {
        DISQUS.reset({
            reload: true,
            config: function () {
                this.page.identifier = newIdentifier;
                this.page.url = newUrl;
                this.page.title = newTitle;
                this.language = newLanguage;
            }
        });
    };
}
