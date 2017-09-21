// $("#addCommentButton").on("click", function() {
//   $.ajax({
//     type: "POST",
//     url: "/add/comment/:id",
//     dataType: "json",
//     data: {
//       athor: $("#author_name").val(),
//       comments: $("#comment_box").val(),
//       created: Date.now()
//     }
//   })
//   .done(function(data) {
//     console.log(data);
//     getComment();
//     $("#author_name").val("");
//     $("#comment_box").val("");
//   }
//   );
//   return false;
// });

// function getComment() {
//   // $("#comment_box").empty();
//   $.getJSON("/remove/comment/:id", function(data) {
//     for (var i = 0; i < data.length; i++) {
//       $("#comment_box").prepend("<tr><td>" + data[i].author + "</td><td>" + data[i].comments +
//         "</td><td><button class='remove' data-id='" + data[i]._id + "'>Remove</button></td></tr>");
//     }
//     $("#comment_box").prepend("<tr><th>Autor</th><th>Comment</th></tr>");
//   });
// }