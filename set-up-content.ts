import {
  createClient,
  createWriteClient,
  createMigration,
} from "@prismicio/client";
import { createPrismicAuthManager } from "@slicemachine/manager";
import sm from "./slicemachine.config.json";
import pkg from "./package.json";

main();

async function main() {
  try {
    const authManager = createPrismicAuthManager();
    const isLoggedIn = await authManager.checkIsLoggedIn();
    if (!isLoggedIn) {
      const sessionInfo = await authManager.getLoginSessionInfo();
      await authManager.nodeLoginSession({
        port: sessionInfo.port,
        onListenCallback() {
          console.log(
            `Open this URL in your browser and log in: ${sessionInfo.url}`,
          );
        },
      });
      console.log("Logged in!");
    }

    // Create clients for both repositories
    const sourceClient = createClient(pkg.name);
    const writeClient = createWriteClient(sm.repositoryName, {
      writeToken: await authManager.getAuthenticationToken(),
    });

    // Verify repository setup
    const repository = await writeClient.getRepository();
    if (!repository.languages || repository.languages.length === 0) {
      console.error("Error: Destination repository has no languages configured.");
      console.log("Please set up your repository first at https://" + sm.repositoryName + ".prismic.io/settings/languages");
      process.exit(1);
    }

    console.log(
      `Fetching source documents from "${sourceClient.repositoryName}"...`,
    );
    const allDocuments = await sourceClient.dangerouslyGetAll();

    const migration = createMigration();
    for (const document of allDocuments) {
      migration.createDocumentFromPrismic(
        document,
        (document.uid || document.type)
          .split(/ -/g)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      );
    }

    console.log(`Copying documents to "${writeClient.repositoryName}"...`);
    await writeClient.migrate(migration);

    console.log(
      `Done! Next, visit https://${sm.repositoryName}.prismic.io/builder/migration to publish your release.`,
    );
  } catch (error) {
    console.error("An error occurred during migration:");
    console.error(error);
    process.exit(1);
  }
}
