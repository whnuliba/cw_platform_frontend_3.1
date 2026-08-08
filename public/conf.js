
(function(){
    let title = 'Huaqin Automated Warehouse Monitoring Platform'
    window["global_method"] = {
        getAppName: function(){
            return title
        }
    }
    let languageOptions = [
        {language:'zh',languageName:'中文'},
        {language:'en',languageName:'English'},
        {language:'de',languageName:'deutsch'},
        {language:'ja',languageName:'Japan'}
     ];
    // let language_type;
    // let language;
    let defaultI18n = {
        zh:{
            login:{
                logIn:"登录",
                username:"用户名",
                password: "密码"
            },
            navbar:{
                search:'搜索',
                task:'任务',
                backlog:'待办'
            }
        },
        en:{
            login:{
                logIn:"Login",
                username:"Username",
                password:'Password'
            },
            navbar:{
                search:'Search',
                task:'Work Task',
                backlog:'To Do'
            }
        },
        de:{
            login:{
                logIn:"Anmeldung",
                username:"Nutzername",
                password: "Passwort",
            },
            navbar:{
                   search:'durchsuchen',
                task:'Aufgabe f.',
                backlog:'in der Schwebe'
            }
        },
        ja:{}
    };
    languageOptions.forEach(item=>{
        loadScript(`lang/${item.language}.js`,function(c){
            defaultI18n[language_type] = language
        });
       
    })

    window["global_parameters"] = {
        appName: title,
        loginCheck: "10.2.200.210:7700",
        authRoot: "/cw-fms-auth",
        taskRoot: "/cw-fms-task",
        fmsRoot: "/cw-fms-fms",
        mdmRoot: "/cw-pms-mdm",
        tpmRoot: "/cw-pms-tpm",
        fmsHisRoot: "/cw-pms-archive",
        wcsRoot: "/tti-mes-wcs",
        wmsRoot: "/cw-wms-app",
        serverRoot: "/cw-pms-server",
        productRoot: "/cw-pms-app",
        modelRoot: "/page/model/", 
        requestTimeout: 120000,
        defaultLang:"en",
        selectLang:languageOptions,
        defaultI18n:defaultI18n,
        homePagePath:'/cw/CwPageView/pms/dashboard',
        defaultLogoutExpireTime:1800 //Second
    }
    
    function loadScript(url, callback) {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }
})()