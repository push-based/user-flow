When you write flows for several pages, many interactions or even different platforms, the amount of low-level Puppeteer code grows quickly. Selectors get duplicated, waiting logic drifts apart and a markup change breaks a dozen files. UFOs, short for **user flow objects**, keep that under control.

> **Organise cluttered Lighthouse user flow code 👽 in developer friendly shells 🛸**

![Advanced architecture: fixtures, UFOs and user flows](https://user-images.githubusercontent.com/10064416/208248762-504897a3-3ef5-42dc-8060-70cda0ad682f.PNG)

## The idea

UFOs are close to the [Page Object](https://martinfowler.com/bliki/PageObject.html) pattern: a class per piece of UI that hides _how_ the UI is accessed behind methods that say _what_ happens. The difference is the focus. A UFO cares about performance relevant moments, for example "the LCP element of this list is visible" or "this facade became interactive".

The code is split into three layers:

| Layer          | Contains                                                                          | Changes when                             |
| -------------- | --------------------------------------------------------------------------------- | ---------------------------------------- |
| **Fixtures**   | DOM selectors, as strings or small getter functions                               | Markup or test attributes change         |
| **UFOs**       | Atomic interactions and the logic to detect when an interaction or render is done | Behaviour of a component changes         |
| **User flows** | The sequence of interactions and the measurement steps around them                | The scenario you want to measure changes |

## Folder structure

Keep the flows next to the application but in their own folder with their own rc file:

```text
📦 my-app
 ┣ 📂 src
 ┣ 📂 dist
 ┃ ┗ 📂 my-app-user-flows        ← reports
 ┗ 📂 my-app-user-flows
   ┣ 📄 .user-flowrc.json
   ┣ 📂 fixtures
   ┃ ┗ 📜 list-page.fixture.mts
   ┣ 📂 ufo
   ┃ ┣ 📜 sidebar.ufo.mts
   ┃ ┣ 📜 list.ufo.mts
   ┃ ┗ 📜 list-page.ufo.mts
   ┗ 📂 user-flows
     ┗ 📜 my-user-flow.uf.mts
```

### Setup

Move `.user-flowrc.json` into `my-app-user-flows` and point the paths at the new locations. Paths are relative to where the CLI runs, usually the repository root:

```json title="my-app-user-flows/.user-flowrc.json"
{
  "collect": {
    "url": "http://localhost:4200/",
    "ufPath": "./my-app-user-flows/user-flows"
  },
  "persist": {
    "outPath": "./dist/my-app-user-flows",
    "format": ["html"]
  }
}
```

## Fixtures

Fixtures hold every selector the flows need. Most are plain strings; selectors that depend on an index or an id are small functions.

> [!TIP]
> Avoid selectors that are tied to layout and styling such as `#main-side-bar div.header-wrapper .hamburger-btn`. Add a data attribute that exists only for user flow tests instead, for example `<button data-uf="sidebar--main-btn">`, and select it with `*[data-uf="sidebar--main-btn"]`.

```typescript title="my-app-user-flows/fixtures/list-page.fixture.mts"
export const sidebarBtnSelector = '*[data-uf="sidebar--main-btn"]';
export const sidebarListLinkSelector = '*[data-uf="sidebar--list-link"]';
export const movieListImgSelector = (idx: number): string => `*[data-uf="movie-list--img-${idx}"]`;
```

## UFOs

A UFO wraps the elements of one UI piece and knows how to interact with them and when they are ready. UFOs compose: a page UFO can own several component UFOs.

Extend the `Ufo` class from `@push-based/user-flow`. It takes the Puppeteer page in its constructor and exposes it as `this.page`, so every UFO created inside a flow shares the same page.

```typescript title="my-app-user-flows/ufo/sidebar.ufo.mts"
import { Ufo } from '@push-based/user-flow';
import * as fixtures from '../fixtures/list-page.fixture.mjs';

export class Sidebar extends Ufo {
  btnSelector = fixtures.sidebarBtnSelector;
  listLinkSelector = fixtures.sidebarListLinkSelector;

  async clickSidebarBtn() {
    await this.page.waitForSelector(this.btnSelector);
    await this.page.click(this.btnSelector);
  }

  async navigateToList() {
    await this.page.waitForSelector(this.listLinkSelector);
    await this.page.click(this.listLinkSelector);
  }
}
```

```typescript title="my-app-user-flows/ufo/list.ufo.mts"
import { Ufo } from '@push-based/user-flow';
import * as fixtures from '../fixtures/list-page.fixture.mjs';

export class List extends Ufo {
  itemSelector = fixtures.movieListImgSelector;

  async clickItem(idx = 0) {
    const item = this.itemSelector(idx);
    await this.page.waitForSelector(item);
    await this.page.click(item);
  }

  async awaitLCP() {
    await this.page.waitForSelector(this.itemSelector(0));
  }
}
```

```typescript title="my-app-user-flows/ufo/list-page.ufo.mts"
import { Ufo } from '@push-based/user-flow';
import { List } from './list.ufo.mjs';

export class ListPage extends Ufo {
  list = new List({ page: this.page });

  async awaitLCP() {
    await this.list.awaitLCP();
  }
}
```

Notice how `ListPage.awaitLCP` delegates to the list. The flow does not need to know which element counts as the largest contentful paint of the page; the UFO does.

## User flows

With fixtures and UFOs in place the flow itself is short and reads like the scenario it measures:

```typescript title="my-app-user-flows/user-flows/my-user-flow.uf.mts"
import { UserFlowOptions, UserFlowInteractionsFn, UserFlowContext, UserFlowProvider } from '@push-based/user-flow';
import { Sidebar } from '../ufo/sidebar.ufo.mjs';
import { ListPage } from '../ufo/list-page.ufo.mjs';

const flowOptions: UserFlowOptions = {
  name: 'Category to detail navigation - cold',
};

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, collectOptions } = ctx;

  // Set up UFOs
  const sidebar = new Sidebar({ page });
  const listPage = new ListPage({ page });

  await flow.navigate(collectOptions.url, { name: 'Navigate to start page' });

  await flow.startTimespan({ name: 'Navigate to list page' });
  await sidebar.clickSidebarBtn();
  await sidebar.navigateToList();
  await listPage.awaitLCP();
  await flow.endTimespan();

  await flow.snapshot({ name: 'List page rendered' });
};

export default {
  flowOptions,
  interactions,
} satisfies UserFlowProvider;
```

## Running

Point the CLI at the rc file inside the flows folder:

```bash
npx user-flow -p=./my-app-user-flows/.user-flowrc.json
```

## Example

The [angular-movies](https://github.com/tastejs/angular-movies/tree/main/projects/movies-user-flows/src) project uses this structure for a production Angular application and is a good reference for larger suites.
