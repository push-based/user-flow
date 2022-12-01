export const STATIC_APP_INDEX_NAME = 'index.html';
export const STATIC_APP_INDEX_CONTENT = `
<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Sandbox - Setup</title>
  <meta name="description" content="A simple web project to test the user-flow CLI">
  <meta name="author" content="push-based/user-flow">

</head>

<body>
<h1>Sandbox - Setup</h1>
<p>
  A simple web project to test lighthouse user-flow CLI
</p>
<button id="btn" onclick="document.getElementById('img').style=''">show image</button>
<img id="img" style="display: none;" src="user-flow-square.ts" alt="user-flow">
</body>
</html>
`;
