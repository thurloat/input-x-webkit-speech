This is a demo app for <input x-webkit-speech> found in Chrome 8+

JS is Compiled using Google Closure Library / Compiler, Backend written on App Engine

----
## To Compile
    closurebuilder.py --root=~/closure/lib/ \
                  --root=js/ \
                  --namespace="thurloat.voiceChat" \
                  --output_mode=compiled \
                  --compiler_jar=~/closure/compiler.jar \
                  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" > output.js
