const commentTemplate = document.querySelector(".comment-container");
const commentsList = document.querySelector(".comments-list");
const commentContainer = document.querySelector(".add-comment-container");
let dataArray;

// Fetch comments data
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    dataArray = data;
    displayComments();
  });

// Event listener for adding a new comment
commentContainer.querySelector("#send-comment-btn").addEventListener("click", addNewComment);

// Display comments
function displayComments() {
  commentsList.innerHTML = "";
  dataArray.comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    displayReplies(commentElement, comment.replies);
    commentsList.appendChild(commentElement);
  });
}

// Create a comment element
function createCommentElement(comment) {
  const newComment = commentTemplate.cloneNode(true);
  newComment.classList.remove("hidden");
  fillCommentDetails(newComment, comment);
  
  if (isCurrentUser(comment.user)) {
    setUpUserButtons(newComment, comment);
  } else {
    setUpReplyButton(newComment, comment);
  }

  setUpScoreButtons(newComment, comment);

  return newComment;
}

// Fill comment details
function fillCommentDetails(commentElement, comment) {
  commentElement.querySelector("header img").src = comment.user.image.png;
  commentElement.querySelector(".comment-name").innerText = comment.user.username;
  commentElement.querySelector(".comment-created-at").innerText = comment.createdAt;
  commentElement.querySelector(".comment-content .comment-text").innerText = comment.content;
  commentElement.querySelector(".comment-score span").innerText = comment.score;
}

// Display replies
function displayReplies(commentElement, replies) {
  const repliesList = commentElement.querySelector(".replies-list");
  replies.forEach((reply) => {
    const replyElement = createCommentElement(reply);
    replyElement.querySelector(".replying-to").innerText = `@${reply.replyingTo} `;
    repliesList.appendChild(replyElement);
  });
}

// Set up score buttons
function setUpScoreButtons(commentElement, comment) {
  commentElement.querySelector("#add-score-btn").addEventListener("click", () => updateScore(comment, 1));
  commentElement.querySelector("#sub-score-btn").addEventListener("click", () => updateScore(comment, -1));
}

// Update comment score
function updateScore(comment, delta) {
  comment.score = Math.max(0, comment.score + delta);
  displayComments();
}

// Set up user buttons (edit, delete)
function setUpUserButtons(commentElement, comment) {
  commentElement.querySelector(".you-stamp").classList.remove("hidden");
  commentElement.querySelector("#edit-btn").classList.remove("hidden");
  commentElement.querySelector("#delete-btn").classList.remove("hidden");

  commentElement.querySelector("#edit-btn").addEventListener("click", () => initiateEditComment(commentElement, comment));
  commentElement.querySelector("#delete-btn").addEventListener("click", () => confirmDeleteComment(comment));
}

// Initiate comment editing
function initiateEditComment(commentElement, comment) {
  const editPlaceholder = commentElement.querySelector(".comment-edit-placeholder");
  editPlaceholder.classList.remove("hidden");
  editPlaceholder.querySelector("textarea").value = comment.content;
  commentElement.querySelector(".comment-content").classList.add("hidden");

  editPlaceholder.querySelector("#comment-edit-btn").addEventListener("click", () => {
    editComment(comment, editPlaceholder.querySelector("textarea").value);
  });
}

// Set up reply button
function setUpReplyButton(commentElement, comment) {
  const replyButton = commentElement.querySelector("#reply-btn");
  replyButton.classList.remove("hidden");

  replyButton.addEventListener("click", () => {
    const replyContainer = commentElement.querySelector(".reply-container");
    replyContainer.classList.toggle("hidden");
    replyContainer.querySelector("textarea").value = `@${comment.user.username}, `;

    replyContainer.querySelector("#comment-reply-btn").addEventListener("click", () => {
      const replyContent = replyContainer.querySelector("textarea").value.replace(`@${comment.user.username}, `, "");
      replyToComment(comment, replyContent);
    });
  });
}

// Add a new comment
function addNewComment() {
  const newCommentText = commentContainer.querySelector("#comment-text").value.trim();
  if (newCommentText === "") return;

  commentContainer.querySelector("#comment-text").value = "";
  const newComment = {
    id: getNextId(),
    content: newCommentText,
    createdAt: "now",
    score: 0,
    user: dataArray.currentUser,
    replies: [],
  };

  dataArray.comments.push(newComment);
  displayComments();
}

// Reply to a comment
function replyToComment(comment, content) {
  const reply = {
    id: getNextId(),
    content,
    createdAt: "now",
    score: 0,
    replyingTo: comment.user.username,
    user: dataArray.currentUser,
  };

  if (!comment.replies) {
    comment.replies = [];
  }

  comment.replies.push(reply);
  displayComments();
}

// Edit a comment
function editComment(comment, content) {
  comment.content = content;
  comment.createdAt = "now";
  displayComments();
}

// Delete a comment
function deleteComment(comment) {
  dataArray.comments = dataArray.comments.filter((dataComment) => {
    if (dataComment.id === comment.id) return false;
    dataComment.replies = dataComment.replies.filter((reply) => reply.id !== comment.id);
    return true;
  });
  displayComments();
}

// Get the next ID for a new comment or reply
function getNextId() {
  const lastId = Math.max(
    ...dataArray.comments.map((comment) => [comment.id, ...comment.replies.map((reply) => reply.id)]).flat()
  );
  return lastId + 1;
}

// Check if the comment belongs to the current user
function isCurrentUser(user) {
  return user.username === dataArray.currentUser.username;
}
