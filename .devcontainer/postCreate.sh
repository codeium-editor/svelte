cd /workspace

if [ -d /workspace/node_modules/ ]; then
  rm -rf /workspace/node_modules/;
fi

bun install