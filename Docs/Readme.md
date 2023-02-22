

<script>
function zoomImage(event) {
  var img = event.target;
  var modal = document.createElement('div');
  modal.style.display = 'block';
  modal.style.position = 'fixed';
  modal.style.zIndex = '999';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  modal.onclick = function() {
    modal.style.display = 'none';
  };
  var modalImg = document.createElement('img');
  modalImg.src = img.src;
  modalImg.style.width = 'auto';
  modalImg.style.height = '90%';
  modalImg.style.margin = 'auto';
  modalImg.style.display = 'block';
  modal.appendChild(modalImg);
  document.body.appendChild(modal);
}
</script>


<img src="assessment-1-Page-1.png" alt="description of the image" width="500px" onclick="zoomImage(event)">
