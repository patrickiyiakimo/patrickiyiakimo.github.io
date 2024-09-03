const commentTemplate = document.querySelector(".comment-container");
const commentsList = document.querySelector(".comments-list");
const commentContainer = document.querySelector(".add-comment-container");
let dataArray;

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    dataArray = data;
    displayComments();
  });

commentContainer
  .querySelector("#send-comment-btn")
  .addEventListener("click", () => {
    const newComment = commentContainer.querySelector("#comment-text").value;
    commentContainer.querySelector("#comment-text").value = "";
    dataArray.comments.push({
      id: getLastId() + 1,
      content: newComment,
      createdAt: "now",
      score: 0,
      user: dataArray.currentUser,
      replies: [],
    });
    displayComments();
  });

function displayComments() {
  commentsList.innerHTML = "";
  dataArray.comments.forEach((comment) => {
    const newComment = createComment(comment);
    comment.replies.forEach((reply) => {
      const newReply = createComment(reply);
      newReply.querySelector(
        ".replying-to"
      ).innerText = `@${reply.replyingTo} `;
      newComment.querySelector(".replies-list").appendChild(newReply);
    });
    commentsList.appendChild(newComment);
  });
}

function createComment(comment) {
  const newComment = commentTemplate.cloneNode(true);
  newComment.classList.remove("hidden");
  newComment.querySelector("header img").src = comment.user.image.png;
  newComment.querySelector(".comment-name").innerText = comment.user.username;
  newComment.querySelector(".comment-created-at").innerText = comment.createdAt;
  newComment.querySelector(".comment-content .comment-text").innerText =
    comment.content;
  newComment.querySelector(".comment-score span").innerText = comment.score;

  if (comment.user.username === dataArray.currentUser.username) {
    setUpUserButtons(newComment, comment, dataArray);
  } else {
    setUpReplyButton(newComment, comment);
  }

  newComment.querySelector("#add-score-btn").addEventListener("click", () => {
    comment.score++;
    newComment.querySelector(".comment-score span").innerText = comment.score;
  });
  newComment.querySelector("#sub-score-btn").addEventListener("click", () => {
    if (comment.score == 0) return;
    comment.score--;
    newComment.querySelector(".comment-score span").innerText = comment.score;
  });

  return newComment;
}

function setUpUserButtons(commentElement, comment) {
  commentElement.querySelector(".you-stamp").classList.remove("hidden");
  commentElement.querySelector("#edit-btn").classList.remove("hidden");
  commentElement.querySelector("#edit-btn").addEventListener("click", () => {
    commentElement
      .querySelector(".comment-edit-placeholder")
      .classList.remove("hidden");
    commentElement
      .querySelector(".comment-edit-placeholder")
      .querySelector("textarea").value =
      commentElement.querySelector(".comment-text").innerText;
    commentElement.querySelector(".comment-content").classList.add("hidden");
    commentElement
      .querySelector(".comment-edit-placeholder")
      .querySelector("#comment-edit-btn")
      .addEventListener("click", () => {
        editComment(
          comment,
          commentElement
            .querySelector(".comment-edit-placeholder")
            .querySelector("textarea").value
        );
      });
  });
  commentElement.querySelector("#delete-btn").classList.remove("hidden");
  commentElement.querySelector("#delete-btn").addEventListener("click", () => {
    const deleteConfirm = document.querySelector(".delete-confirm-container");
    deleteConfirm.classList.remove("hidden");
    deleteConfirm
      .querySelector("#delete-cancel-btn")
      .addEventListener("click", () => {
        deleteConfirm.classList.add("hidden");
      });
    deleteConfirm
      .querySelector("#delete-confirm-btn")
      .addEventListener("click", () => {
        deleteComment(comment);
        deleteConfirm.classList.add("hidden");
      });
  });
}

function setUpReplyButton(commentElement, comment) {
  commentElement.querySelector("#reply-btn").classList.remove("hidden");
  commentElement.querySelector("#reply-btn").addEventListener("click", () => {
    const replyContainer = commentElement.querySelector(".reply-container");
    replyContainer.classList.toggle("hidden");
    replyContainer.querySelector(
      "textarea"
    ).innerText = `@${comment.user.username}, `;
    replyContainer
      .querySelector("#comment-reply-btn")
      .addEventListener("click", () => {
        let replyContent = replyContainer.querySelector("textarea").value;
        replyContent = replyContent.replace(`@${comment.user.username}, `, "");
        replyComment(comment, replyContent);
      });
  });
}

function deleteComment(comment) {
  dataArray.comments.forEach((dataComment, index) => {
    if (dataComment.id === comment.id) {
      dataArray.comments.splice(index, 1);
      displayComments();
      return;
    }
    dataComment.replies.forEach((dataReply, replyIndex) => {
      if (dataReply.id === comment.id) {
        dataComment.replies.splice(replyIndex, 1);
        displayComments();
        return;
      }
    });
  });
}

function editComment(comment, content) {
  dataArray.comments.forEach((dataComment, index) => {
    if (dataComment.id === comment.id) {
      dataArray.comments[index].content = content;
      displayComments();
      return;
    }
    dataComment.replies.forEach((dataReply, replyIndex) => {
      if (dataReply.id === comment.id) {
        dataArray.comments[index].replies[replyIndex].content = content;
        dataArray.comments[index].replies[replyIndex].createdAt = "now";
        displayComments();
        return;
      }
    });
  });
}

function replyComment(comment, content) {
  dataArray.comments.forEach((dataComment, index) => {
    if (dataComment.id === comment.id) {
      dataArray.comments[index].replies.push({
        id: getLastId() + 1,
        content: content,
        createdAt: "now",
        score: 0,
        replyingTo: comment.user.username,
        user: dataArray.currentUser,
      });
      displayComments();
      return;
    }
    dataComment.replies.forEach((dataReply, replyIndex) => {
      if (dataReply.id === comment.id) {
        dataArray.comments[index].replies[replyIndex].replies.push({
          id: getLastId() + 1,
          content: content,
          createdAt: "now",
          score: 0,
          replyingTo: comment.user.username,
          user: dataArray.currentUser,
        });
        displayComments();
        return;
      }
    });
  });
}

function getLastId() {
  let lastId = 0;
  dataArray.comments.forEach((comment) => {
    if (comment.id > lastId) {
      lastId = comment.id;
    }
    comment.replies.forEach((relpy) => {
      if (relpy.id > lastId) {
        lastId = relpy.id;
      }
    });
  });
  return lastId;
}
