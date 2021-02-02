import {Application} from '../components/application';
import {createStore} from '../store';

async function main() {
  const store = createStore(Application);

  try {
    await refreshAllGitHubData();
  } finally {
    await store.disconnect();
  }
}

export async function countPendingIssues() {
  const {GitHub} = Application;

  const count = await GitHub.countPendingIssues({
    owner: 'gothinkster',
    name: 'react-mobx-realworld-example-app'
  });

  console.log(`Pending issues: ${count}`);
}

export async function refreshAllGitHubData() {
  const {Implementation} = Application;

  await Implementation._refreshGitHubData();
}

main().catch((error) => {
  console.error(error);
});
