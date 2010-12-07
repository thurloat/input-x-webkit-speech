This is a demo app for &lt;input x-webkit-speech&gt; found in Chrome 8+

----
## To Compile

JS is Compiled using Google Closure Library / Compiler, Backend written on App Engine

    closurebuilder.py --root=~/closure/lib/ \
                  --root=js/ \
                  --namespace="thurloat.voiceChat" \
                  --output_mode=compiled \
                  --compiler_jar=~/closure/compiler.jar \
                  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" > output.js
