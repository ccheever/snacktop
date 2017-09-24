import { SnackSession } from "snack-sdk";
import qrcodeTerminal from "qrcode-terminal";
import "instapromise";
import fs from "fs";

const srcFilePath = "./code.js";

(async () => {
  let code = await fs.promise.readFile(srcFilePath, "utf8");
  let session = new SnackSession({
    code,
    sdkVersion: "21.0.0",
    verbose: true
  });

  await session.startAsync();

  let url = await session.getUrlAsync();
  qrcodeTerminal.generate(url);

  async function updateSourceAsync() {
      let code = await fs.promise.readFile(srcFilePath, "utf8");
      await session.sendCodeAsync(code);
  }

  fs.watch(srcFilePath, (eventType, filename) => {
    console.log(`event type is: ${eventType}`);
    if (filename) {
      console.log(`filename provided: ${filename}`);
      updateSourceAsync();
    } else {
      console.log('filename not provided');
    }
  });
  

})().then(console.log, console.error);
