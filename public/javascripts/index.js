function toggleCollapse(id) {
  const content = document.getElementById(id);
  const icon = document.getElementById(`${id}-icon`);

  // Toggle visibility
  if (content.classList.contains("hidden")) {
    content.classList.remove("hidden");
    content.classList.add("flex");
    icon.classList.add("rotate-180");
  } else {
    content.classList.add("hidden");
    content.classList.remove("flex");
    icon.classList.remove("rotate-180");
  }
}
