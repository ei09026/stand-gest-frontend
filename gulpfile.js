var gulp = require('gulp')
var shelljs = require('shelljs/global')
var fs = require('fs')
var path = require('path')
var dotty = require('dotty')
var jsonfile = require('jsonfile')
var gutil = require('gulp-util')
var crypto = require('crypto')
var replace = require('replace')
var concat = require('gulp-concat')
// var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css')
var externalJSAssets = require('./config/external.javascript.assets.js')
var externalCSSAssets = require('./config/external.css.assets.js')

gulp.task('default', ['generate-languages'], function () {
    gulp.watch(['resources/lang/**/*.json'], ['generate-languages'])
})

gulp.task('generate-languages', function (callback) {
    cleanOldLanguageFiles()
    processLanguages()
    setEnvBuildHash()
    callback()
})

gulp.task('generate-external-assets', function (callback) {
    generateExternalJS()
    generateExternalCSS()
    callback()
})

gulp.task('build-static-path', function (callback) {
    var appEnv = parseAppEnv()

    if (appEnv.router_prefix) {
        setRouterPrefixCss('pw-css', appEnv.router_prefix)
        setRouterPrefixCss('pwc-css', appEnv.router_prefix)
        setRouterPrefixCss('fw-css', appEnv.router_prefix)
        setRouterPrefixCss('gf-css', appEnv.router_prefix)

        setRouterPrefixJs('pw-js', appEnv.router_prefix)
        setRouterPrefixJs('pwc-js', appEnv.router_prefix)

        console.log('Build static path Done.')
    }

    callback()
})

gulp.task('set-build-version', function (callback) {
    let args = getArguments()

    console.log('Build: ' + args.build)

    let buildNumber = '    build_number: ' + "'" + args.build + "'"

    replace({
        regex: '[^\n]*build_number[^\n]*',
        replacement: buildNumber,
        paths: [path.join(path.join(process.cwd(), 'src'), '.env.js')],
        recursive: false,
        silent: true
    })
})

function parseAppEnv() {
    var content = fs.readFileSync(path.join(path.join(process.cwd(), 'src'), '.env.js'), 'utf8').split('let env =').pop().split('export default env').shift()
    var envObj = {}

    eval('var envObj=' + content)

    return envObj
}

function setRouterPrefixCss(elemId, prefix) {
    replace({
        regex: '(id=' + elemId + ' href=/|id=' + elemId + ' href=)',
        replacement: 'href=/' + prefix + '/',
        paths: [path.join(path.join(process.cwd(), 'dist'), 'index.html')],
        recursive: false,
        silent: true
    })
}

function setRouterPrefixJs(elemId, prefix) {
    replace({
        regex: '(id=' + elemId + ' src=/|id=' + elemId + ' src=)',
        replacement: 'src=/' + prefix + '/',
        paths: [path.join(path.join(process.cwd(), 'dist'), 'index.html')],
        recursive: false,
        silent: true
    })
}

function generateExternalJS() {
    var rootPath = path.join(process.cwd())
    var jsDestination = path.join(rootPath, '/resources/vendor')

    var jsFiles = externalJSAssets.map(function (file) {
        return path.join(rootPath, '/resources/vendor', file)
    })

    var stream = gulp.src(jsFiles, {
            base: path.join(rootPath, '/resources/vendor')
        })
        .pipe(uglify())
        .pipe(concat('app.external-assets.js'))
        .pipe(gulp.dest(jsDestination))

    stream.on('end', function () {
        console.log('JS Done.')
        // fs.unlink(path.join(process.cwd(), 'resources', 'vendor', 'app.external-assets.js'), function (err) {
        //     if (err) {
        //         return console.log(err)
        //     }
        // })
    })
}

function generateExternalCSS() {
    var rootPath = path.join(process.cwd())
    var cssDest = path.join(rootPath, '/resources/vendor')

    var cssFiles = externalCSSAssets.map(function (file) {
        return path.join(rootPath, '/resources/vendor', file)
    })

    var totalOriginalSize = 0
    var totalMinifiedSize = 0

    var stream = gulp.src(cssFiles)
        .pipe(cleanCSS({
            debug: true
        }, (details) => {
            totalOriginalSize += details.stats.originalSize;
            totalMinifiedSize += details.stats.minifiedSize;

            console.log(`Original size -> ${details.name}: ${details.stats.originalSize} bytes.`)
            console.log(`Minified size -> ${details.name}: ${details.stats.minifiedSize} bytes.`)
            console.log(`Saved ${details.stats.originalSize-details.stats.minifiedSize} bytes.`)
        }))
        .pipe(concat('app.external-assets.css'))
        .pipe(gulp.dest(cssDest))

    stream.on('end', function () {
        console.log(`CSS Done (Saved ${totalOriginalSize-totalMinifiedSize} bytes).`)
        // fs.unlink(path.join(process.cwd(), 'resources', 'vendor', 'app.external-assets.js'), function (err) {
        //     if (err) {
        //         return console.log(err)
        //     }
        // })
    })
}

var langPath = 'resources/lang'
var langFileObj = {}
var currentKey = null
var basePath = path.join(process.cwd(), langPath)
var buildHash = crypto.randomBytes(10).toString('hex')

function setEnvBuildHash() {
    var hashKey = '    build_hash: ' + "'" + buildHash + "',"

    replace({
        regex: '[^\n]*build_hash[^\n]*',
        replacement: hashKey,
        paths: [path.join(path.join(process.cwd(), 'src'), '.env.js')],
        recursive: false,
        silent: true
    })
}

function addToLanguage(obj, objKey, objValue) {
    dotty.put(obj, objKey, objValue)
}

function getFileContents(file) {
    return jsonfile.readFileSync(file)
}

function setCurrentKey(fullPath) {
    var tmpPath = fullPath.replace(basePath, '').split(path.sep)
    currentKey = tmpPath.join('.').replace('.json', '')

    if (currentKey.substring(0, 1) !== '.') {
        currentKey = '.' + currentKey
    }
}

function cleanOldLanguageFiles() {
    var staticLangPath = path.join('static', 'lang')
    var fullStaticLangPath = path.join(path.join(process.cwd(), staticLangPath))

    // clean old language files before creating new ones
    ls(staticLangPath).forEach(function (file) {
        var stat = fs.statSync(path.join(fullStaticLangPath, file))
        if (stat && stat.isFile()) {
            fs.unlink(path.join(fullStaticLangPath, file), function (err) {
                if (err) {
                    return console.log(err)
                }
            })
        }
    })
}

function writeLanguageFile(locale) {
    var destPath = path.join(process.cwd(), 'static')

    destPath = path.join(destPath, 'lang')
    jsonfile.writeFileSync(path.join(destPath, locale + '.' + buildHash + '.json'), langFileObj[''][locale])
}

function processLanguages() {
    var locales = []
    var currentLocale = null

    ls(langPath).forEach(function (file) {
        var stat = fs.statSync(path.join(basePath, file))
        if (stat && stat.isDirectory()) {
            locales.push(file)
        }
    })

    for (var i = 0; i < locales.length; i++) {
        // console.log('Processing locale "' + locales[i] + '"')
        gutil.log('Processing locale "' + locales[i] + '"')
        currentLocale = locales[i]

        processAllLangFiles(path.join(langPath, currentLocale))
        writeLanguageFile(currentLocale)
        // console.log('Done with "' + locales[i] + '"')
        gutil.log('Done with "' + locales[i] + '"')
    }
}

function processAllLangFiles(dir) {
    var langFileContent = ''
    var fullPath = process.cwd() + path.sep

    fs.readdirSync(path.join(fullPath, dir)).forEach(function (file) {
        var name = file
        file = path.join(dir, file)
        var stat = fs.statSync(file)

        if (stat && stat.isDirectory()) {
            setCurrentKey(dir)
            var newObj = {}
            newObj[name] = {}

            addToLanguage(langFileObj, currentKey, newObj)
            processAllLangFiles(file)
        } else {
            setCurrentKey(path.join(fullPath, file))
            var fileContent = getFileContents(path.join(fullPath, file))
            addToLanguage(langFileObj, currentKey, fileContent)
        }
    })

    return langFileContent
}

function getArguments() {
    let arg = {}
    let a
    let opt
    let thisOpt
    let curOpt

    let argList = process.argv

    for (a = 0; a < argList.length; a++) {
        thisOpt = argList[a].trim()
        opt = thisOpt.replace(/^\-+/, '')

        if (opt === thisOpt) {
            // argument value
            if (curOpt) {
                arg[curOpt] = opt
            }
            curOpt = null
        } else {
            // argument name
            curOpt = opt
            arg[curOpt] = true
        }
    }

    return arg
}
