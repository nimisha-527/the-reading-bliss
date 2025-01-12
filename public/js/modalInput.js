const ModalPopup = document.getElementById('ModalPopup')
if (ModalPopup) {
  ModalPopup.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const bookTitle = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = ModalPopup.querySelector('.modal-title')
    modalTitle.textContent = `Recommend - ${bookTitle}`

    // Image of the modal
    const modalBodyImage = ModalPopup.querySelector('#image')
    const imageLink = modalBodyImage.getAttribute('value')
    modalBodyImage.value = imageLink

    // Description of the modal
    const modalBodyDescription = ModalPopup.querySelector('#description-text')
    const description = modalBodyDescription.getAttribute('value')
    modalBodyDescription.value = description
  })
}