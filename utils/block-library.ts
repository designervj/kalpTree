import { BlockConfig } from "../types/editor";



// Enhanced blocks library with additional components
export const defaultBlocks: BlockConfig[] = [
  // Basic blocks
  {
    id: "section",
    label: "Section",
    category: "Basic",
    content:
      '<section class="py-16 bg-gray-50"><div class="container mx-auto px-4 max-w-6xl">Section Content</div></section>',
    attributes: { class: "gjs-block-section" },
  },
  {
    id: "text",
    label: "Text",
    category: "Basic",
    content:
      '<div data-gjs-type="text" class="text-gray-700 text-base leading-relaxed">Insert your text here</div>',
    attributes: { class: "gjs-block-text" },
  },
  {
    id: "link",
    label: "Link",
    category: "Basic",
    content: {
      type: "link",
      content: "Link",
      attributes: {
        href: "#",
        class:
          "text-primary hover:text-primary/80 underline transition-colors duration-200",
      },
    },
    attributes: { class: "gjs-block-link" },
  },
  {
    id: "link-block",
    label: "Link Block",
    category: "Basic",
    content:
      '<a href="#" class="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200">Link block</a>',
    attributes: { class: "gjs-block-link-block" },
  },
  {
    id: "quote",
    label: "Quote",
    category: "Basic",
    content: `<blockquote class="p-6 my-6 border-l-4 border-primary bg-gray-50 italic">
      <p class="text-lg text-gray-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <footer class="text-sm text-gray-500 font-medium">— Author</footer>
    </blockquote>`,
    attributes: { class: "gjs-block-quote" },
  },
  {
    id: "text-section",
    label: "Text section",
    category: "Basic",
    content: `<div class="py-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Insert title here</h2>
      <p class="text-gray-600 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>`,
    attributes: { class: "gjs-block-text-section" },
  },
  {
    id: "divider",
    label: "Divider",
    category: "Basic",
    content: '<hr class="my-8 border-t border-gray-300">',
    attributes: { class: "gjs-block-divider" },
  },
  {
    id: "spacer",
    label: "Spacer",
    category: "Basic",
    content: '<div class="py-8"></div>',
    attributes: { class: "gjs-block-spacer" },
  },

  // Media blocks
  {
    id: "image",
    label: "Image",
    category: "Media",
    content: {
      type: "image",
      attributes: {
        class: "w-full h-auto rounded-lg shadow-md",
      },
    },
    attributes: { class: "gjs-block-image" },
  },
  {
    id: "image-text",
    label: "Image + Text",
    category: "Media",
    content: `<div class="flex flex-col md:flex-row gap-8 items-center">
      <div class="w-full md:w-1/2">
        <img src="https://via.placeholder.com/600x400" alt="Placeholder" class="w-full h-auto rounded-lg shadow-md">
      </div>
      <div class="w-full md:w-1/2">
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Image Title</h3>
        <p class="text-gray-600 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Add your description here.</p>
      </div>
    </div>`,
    attributes: { class: "gjs-block-image-text" },
  },
  {
    id: "video",
    label: "Video",
    category: "Media",
    content: `<div class="relative w-full rounded-lg overflow-hidden shadow-md" style="padding-bottom: 56.25%">
      <iframe
        src="https://www.youtube.com/embed/jNQXAC9IVRw"
        class="absolute top-0 left-0 w-full h-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>`,
    attributes: { class: "gjs-block-video" },
  },
  {
    id: "gallery",
    label: "Image Gallery",
    category: "Media",
    content: `<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <img src="https://via.placeholder.com/400" alt="Gallery 1" class="w-full h-48 object-cover rounded-lg shadow-md">
      <img src="https://via.placeholder.com/400" alt="Gallery 2" class="w-full h-48 object-cover rounded-lg shadow-md">
      <img src="https://via.placeholder.com/400" alt="Gallery 3" class="w-full h-48 object-cover rounded-lg shadow-md">
      <img src="https://via.placeholder.com/400" alt="Gallery 4" class="w-full h-48 object-cover rounded-lg shadow-md">
      <img src="https://via.placeholder.com/400" alt="Gallery 5" class="w-full h-48 object-cover rounded-lg shadow-md">
      <img src="https://via.placeholder.com/400" alt="Gallery 6" class="w-full h-48 object-cover rounded-lg shadow-md">
    </div>`,
    attributes: { class: "gjs-block-gallery" },
  },

  // Column blocks
  {
    id: "column1",
    label: "1 Column",
    category: "Basic",
    content: `<div class="w-full" data-gjs-droppable=".cell" data-gjs-custom-name="Row">
      <div class="w-full p-4" data-gjs-draggable=".row" data-gjs-custom-name="Cell">
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">1 Column</div>
      </div>
    </div>`,
    attributes: { class: "gjs-block-column1" },
  },
  {
    id: "column2",
    label: "2 Columns",
    category: "Basic",
    content: `<div class="flex flex-wrap -mx-4" data-gjs-droppable=".cell" data-gjs-custom-name="Row">
      <div class="w-full md:w-1/2 p-4" data-gjs-draggable=".row" data-gjs-custom-name="Cell">
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">Cell 1</div>
      </div>
      <div class="w-full md:w-1/2 p-4" data-gjs-draggable=".row" data-gjs-custom-name="Cell">
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">Cell 2</div>
      </div>
    </div>`,
    attributes: { class: "gjs-block-column2" },
  },
  {
    id: "column3",
    label: "3 Columns",
    category: "Basic",
    content: `<div class="flex flex-wrap -mx-4" data-gjs-droppable=".cell" data-gjs-custom-name="Row">
      <div class="w-full md:w-1/3 p-4" data-gjs-draggable=".row" data-gjs-custom-name="Cell">
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">Cell 1</div>
      </div>
      <div class="w-full md:w-1/3 p-4" data-gjs-draggable=".row" data-gjs-custom-name="Cell">
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">Cell 2</div>
      </div>
      <div class="w-full md:w-1/3 p-4" data-gjs-draggable=".row" data-gjs-custom-name="Cell">
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">Cell 3</div>
      </div>
    </div>`,
    attributes: { class: "gjs-block-column3" },
  },
  {
    id: "column-3-7",
    label: "2 Columns 3/7",
    category: "Basic",
    content: `<div class="grid grid-cols-1 md:grid-cols-10 gap-8 w-full" data-gjs-droppable=".cell" data-gjs-custom-name="Row">
    <div class="md:col-span-3" data-gjs-draggable=".row" data-gjs-custom-name="Cell 30%">
      <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">Cell 30%</div>
    </div>
    <div class="md:col-span-7" data-gjs-draggable=".row" data-gjs-custom-name="Cell 70%">
      <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">Cell 70%</div>
    </div>
  </div>`,
    attributes: { class: "gjs-block-column-3-7" },
  },

  // Map block
  {
    id: "map",
    label: "Map",
    category: "Basic",
    content: `<div class="w-full h-96 rounded-lg overflow-hidden shadow-md border border-gray-200">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30594451354!2d-74.25986613799748!3d40.69714941774136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew+York%2C+NY%2C+USA!5e0!3m2!1sen!2s!4v1644332380705!5m2!1sen!2s"
        width="100%"
        height="100%"
        style="border:0"
        allowfullscreen=""
        loading="lazy"
        class="w-full h-full">
      </iframe>
    </div>`,
    attributes: { class: "gjs-block-map" },
  },

  // Form blocks
  {
    id: "form",
    label: "Form",
    category: "Forms",
    content: `<form data-gjs-type="form" class="space-y-6 max-w-lg">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input type="text" placeholder="Your name" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input type="email" placeholder="your@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea rows="4" placeholder="Your message" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
      </div>
      <button type="submit" class="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200">Submit</button>
    </form>`,
    attributes: { class: "gjs-block-form" },
  },
  {
    id: "input",
    label: "Input",
    category: "Forms",
    content: `<div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Label</label>
      <input type="text" placeholder="Enter text" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
    </div>`,
    attributes: { class: "gjs-block-input" },
  },
  {
    id: "textarea",
    label: "Textarea",
    category: "Forms",
    content: `<div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
      <textarea rows="4" placeholder="Enter your message" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
    </div>`,
    attributes: { class: "gjs-block-textarea" },
  },
  {
    id: "select",
    label: "Select",
    category: "Forms",
    content: `<div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Option</label>
      <select class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </select>
    </div>`,
    attributes: { class: "gjs-block-select" },
  },
  {
    id: "checkbox",
    label: "Checkbox",
    category: "Forms",
    content: `<div class="flex items-center mb-4">
      <input type="checkbox" class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
      <label class="ml-2 text-sm text-gray-700">Checkbox label</label>
    </div>`,
    attributes: { class: "gjs-block-checkbox" },
  },
  {
    id: "radio",
    label: "Radio",
    category: "Forms",
    content: `<div class="space-y-2">
      <div class="flex items-center">
        <input type="radio" name="radio-group" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
        <label class="ml-2 text-sm text-gray-700">Option 1</label>
      </div>
      <div class="flex items-center">
        <input type="radio" name="radio-group" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
        <label class="ml-2 text-sm text-gray-700">Option 2</label>
      </div>
    </div>`,
    attributes: { class: "gjs-block-radio" },
  },

  // Components
  {
    id: "button",
    label: "Button",
    category: "Components",
    content:
      '<button class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200">Button</button>',
    attributes: { class: "gjs-block-button" },
  },
  {
    id: "button-outline",
    label: "Outline Button",
    category: "Components",
    content:
      '<button class="px-6 py-3 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-200">Outline Button</button>',
    attributes: { class: "gjs-block-button-outline" },
  },

  {
    id: "alert",
    label: "Alert",
    category: "Components",
    content: `<div class="p-4 mb-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700">This is an informational alert message.</p>
        </div>
      </div>
    </div>`,
    attributes: { class: "gjs-block-alert" },
  },
  {
    id: "badge",
    label: "Badge",
    category: "Components",
    content:
      '<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">Badge</span>',
    attributes: { class: "gjs-block-badge" },
  },

  {
    id: "cta",
    label: "Call to Action",
    category: "Features",
    content: `<section class="py-16 bg-primary text-white">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <h2 class="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p class="text-xl mb-8 opacity-90">Join thousands of satisfied customers today</p>
        <div class="flex gap-4 justify-center">
          <a href="#" class="px-8 py-3 bg-white text-primary rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200">Start Free Trial</a>
          <a href="#" class="px-8 py-3 border-2 border-white text-white rounded-md font-semibold hover:bg-white hover:text-primary transition-colors duration-200">Contact Sales</a>
        </div>
      </div>
    </section>`,
    attributes: { class: "gjs-block-cta" },
  },
  {
    id: "stats",
    label: "Statistics",
    category: "Features",
    content: `<section class="py-16 bg-gray-900 text-white">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold mb-2">10K+</div>
            <p class="text-gray-400">Happy Customers</p>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">50K+</div>
            <p class="text-gray-400">Projects Completed</p>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">99%</div>
            <p class="text-gray-400">Satisfaction Rate</p>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">24/7</div>
            <p class="text-gray-400">Support Available</p>
          </div>
        </div>
      </div>
    </section>`,
    attributes: { class: "gjs-block-stats" },
  },

  {
    id: "breadcrumb",
    label: "Breadcrumb",
    category: "Navigation",
    content: `<nav class="flex py-4" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-2">
        <li class="inline-flex items-center">
          <a href="#" class="text-gray-700 hover:text-primary">Home</a>
        </li>
        <li>
          <div class="flex items-center">
            <span class="mx-2 text-gray-400">/</span>
            <a href="#" class="text-gray-700 hover:text-primary">Category</a>
          </div>
        </li>
        <li>
          <div class="flex items-center">
            <span class="mx-2 text-gray-400">/</span>
            <span class="text-gray-500">Current Page</span>
          </div>
        </li>
      </ol>
    </nav>`,
    attributes: { class: "gjs-block-breadcrumb" },
  },
  {
    id: "pagination",
    label: "Pagination",
    category: "Navigation",
    content: `<nav class="flex justify-center" aria-label="Pagination">
      <ul class="flex space-x-2">
        <li>
          <a href="#" class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Previous</a>
        </li>
        <li>
          <a href="#" class="px-3 py-2 rounded-md bg-primary text-white">1</a>
        </li>
        <li>
          <a href="#" class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">2</a>
        </li>
        <li>
          <a href="#" class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">3</a>
        </li>
        <li>
          <a href="#" class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Next</a>
        </li>
      </ul>
    </nav>`,
    attributes: { class: "gjs-block-pagination" },
  },
  // List blocks
  {
    id: "list-bullet",
    label: "Bullet List",
    category: "Lists",
    content: `<ul class="space-y-2 text-gray-700">
      <li class="flex items-start">
        <span class="text-primary mr-2">•</span>
        <span>First list item</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary mr-2">•</span>
        <span>Second list item</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary mr-2">•</span>
        <span>Third list item</span>
      </li>
    </ul>`,
    attributes: { class: "gjs-block-list-bullet" },
  },
  {
    id: "list-numbered",
    label: "Numbered List",
    category: "Lists",
    content: `<ol class="space-y-2 text-gray-700">
      <li class="flex items-start">
        <span class="text-primary font-semibold mr-2">1.</span>
        <span>First list item</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary font-semibold mr-2">2.</span>
        <span>Second list item</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary font-semibold mr-2">3.</span>
        <span>Third list item</span>
      </li>
    </ol>`,
    attributes: { class: "gjs-block-list-numbered" },
  },
  {
    id: "list-checklist",
    label: "Checklist",
    category: "Lists",
    content: `<ul class="space-y-3">
      <li class="flex items-center">
        <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span class="text-gray-700">Completed task</span>
      </li>
      <li class="flex items-center">
        <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span class="text-gray-700">Another completed task</span>
      </li>
      <li class="flex items-center">
        <div class="w-5 h-5 border-2 border-gray-300 rounded mr-3"></div>
        <span class="text-gray-400">Pending task</span>
      </li>
    </ul>`,
    attributes: { class: "gjs-block-list-checklist" },
  },

  // Table
  {
    id: "table",
    label: "Table",
    category: "Components",
    content: `<div class="overflow-x-auto">
      <table class="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Header 1</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Header 2</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2 text-gray-600">Row 1, Cell 1</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">Row 1, Cell 2</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">Row 1, Cell 3</td>
          </tr>
          <tr class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2 text-gray-600">Row 2, Cell 1</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">Row 2, Cell 2</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">Row 2, Cell 3</td>
          </tr>
          <tr class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2 text-gray-600">Row 3, Cell 1</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">Row 3, Cell 2</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">Row 3, Cell 3</td>
          </tr>
        </tbody>
      </table>
    </div>`,
    attributes: { class: "gjs-block-table" },
  },

  // Social media
  {
    id: "social-icons",
    label: "Social Icons",
    category: "Social",
    content: `<div class="flex space-x-4 justify-center">
      <a href="#" class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors duration-200">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      <a href="#" class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors duration-200">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
      </a>
      <a href="#" class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors duration-200">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </a>
      <a href="#" class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors duration-200">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
    </div>`,
    attributes: { class: "gjs-block-social-icons" },
  },

  // Progress
  {
    id: "progress-bar",
    label: "Progress Bar",
    category: "Components",
    content: `<div class="w-full">
      <div class="flex justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">Progress</span>
        <span class="text-sm font-medium text-gray-700">75%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-primary h-2.5 rounded-full" style="width: 75%"></div>
      </div>
    </div>`,
    attributes: { class: "gjs-block-progress-bar" },
  },
  {
    id: "custom-slider",
    label: "Slider",
    category: "Basic",
    content: `
      <section class="hero-section transition-all duration-500 overflow-hidden relative min-h-[640px] flex items-center justify-center text-center text-white bg-black">
        <style>
          .hero-section {
            --primary: #fdb913;
            --dark: #0a1128;
            --white: #ffffff;
            --transition: all 0.3s ease;
          }
          .hero-section .hero-slider {
            position: absolute;
            inset: 0;
            z-index: 1;
          }
          .hero-section .slide {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transform: scale(1.03);
            opacity: 0;
            transition: opacity 900ms ease;
            will-change: opacity;
          }
          .hero-section .slide.is-active {
            opacity: 1;
          }
          .hero-section::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 2;
            background: linear-gradient(rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.62));
          }
          .hero-section .hero-content {
            position: relative;
            z-index: 3;
            width: 100%;
          }
          .hero-section .hero-content h1 {
            font-family: 'Merriweather', serif;
            font-size: 3.5rem;
            color: var(--white);
            margin-bottom: 20px;
            letter-spacing: 1px;
            font-weight: 900;
          }
          .hero-section .hero-content h1 span {
            color: var(--primary);
          }
          .hero-section .hero-content p {
            font-style: italic;
            font-size: 1.2rem;
            margin-bottom: 30px;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.92);
          }
          .hero-section .btn {
            display: inline-block;
            padding: 12px 30px;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
            text-transform: capitalize;
            transition: var(--transition);
          }
          .hero-section .btn-yellow {
            background: var(--primary);
            color: var(--dark);
          }
          .hero-section .btn-yellow:hover {
            background: #e0a710;
            transform: translateY(-2px);
          }
          .hero-section .btn-outline {
            border: 1px solid var(--white);
            color: var(--white);
            background: transparent;
            margin-left: 15px;
          }
          .hero-section .btn-outline:hover {
            background: var(--white);
            color: var(--dark);
          }
          .hero-section .hero-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 4;
            width: 46px;
            height: 46px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.45);
            background: rgba(10, 17, 40, 0.35);
            color: #fff;
            display: grid;
            place-items: center;
            cursor: pointer;
            transition: var(--transition);
            user-select: none;
          }
          .hero-section .hero-nav:hover {
            background: rgba(255, 255, 255, 0.14);
            border-color: rgba(255, 255, 255, 0.7);
          }
          .hero-section .hero-nav.prev {
            left: 20px;
          }
          .hero-section .hero-nav.next {
            right: 20px;
          }
          .hero-section .hero-dots {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 26px;
            z-index: 4;
            display: flex;
            gap: 10px;
            padding: 10px 14px;
            border-radius: 999px;
            background: rgba(10, 17, 40, 0.30);
            border: 1px solid rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(10px);
          }
          .hero-section .hero-dots button {
            width: 9px;
            height: 9px;
            border-radius: 999px;
            border: 0;
            background: rgba(255, 255, 255, 0.45);
            cursor: pointer;
            transition: var(--transition);
          }
          .hero-section .hero-dots button.is-active {
            width: 22px;
            background: var(--primary);
          }
          @media (max-width: 992px) {
            .hero-section .hero-content h1 { font-size: 2.6rem; }
            .hero-section .hero-nav { display: none; }
          }
          @media (max-width: 520px) {
            .hero-section .btn { width: 100%; text-align: center; margin-left: 0 !important; margin-bottom: 10px; }
          }
        </style>
        
        <div class="hero-slider" aria-hidden="true">
          <div class="slide is-active" style="background-image:url('https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&w=1920&q=80');"></div>
          <div class="slide" style="background-image:url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80');"></div>
          <div class="slide" style="background-image:url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1920&q=80');"></div>
        </div>

        <div class="hero-content">
          <div class="container mx-auto px-4">
            <h1>GLOBAL <span>INTERNATIONAL</span> SCHOOL</h1>
            <p>"Shaping Confident Learners For A Global Future"</p>
            <div class="flex flex-wrap justify-center gap-4">
              <a href="#" class="btn btn-yellow">Apply Now</a>
              <a href="#" class="btn btn-outline">Discover More &rarr;</a>
            </div>
          </div>
        </div>

        <button class="hero-nav prev" type="button" aria-label="Previous slide"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="hero-nav next" type="button" aria-label="Next slide"><i class="fa-solid fa-chevron-right"></i></button>

        <div class="hero-dots" aria-label="Hero slider pagination"></div>

        <script>
          (function() {
            const hero = document.currentScript.closest('.hero-section');
            const slides = Array.from(hero.querySelectorAll(".slide"));
            const dotsWrap = hero.querySelector(".hero-dots");
            const btnPrev = hero.querySelector(".hero-nav.prev");
            const btnNext = hero.querySelector(".hero-nav.next");

            if (!slides.length || !dotsWrap) return;

            const AUTOPLAY_MS = 5500;
            let index = 0;
            let timer = null;
            let isPaused = false;

            dotsWrap.innerHTML = '';
            const dots = slides.map((_, i) => {
              const b = document.createElement("button");
              b.type = "button";
              b.setAttribute("aria-label", "Go to slide " + (i + 1));
              b.onclick = () => goTo(i, true);
              dotsWrap.appendChild(b);
              return b;
            });

            function render() {
              slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
              dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
            }

            function goTo(nextIndex, userAction) {
              index = (nextIndex + slides.length) % slides.length;
              render();
              if (userAction) restart();
            }

            function next(userAction) { goTo(index + 1, userAction); }
            function prev(userAction) { goTo(index - 1, userAction); }

            function start() {
              stop();
              timer = setInterval(() => { if (!isPaused) next(false); }, AUTOPLAY_MS);
            }

            function stop() { if (timer) clearInterval(timer); timer = null; }
            function restart() { start(); }

            hero.addEventListener("mouseenter", () => (isPaused = true));
            hero.addEventListener("mouseleave", () => (isPaused = false));

            if (btnNext) btnNext.onclick = () => next(true);
            if (btnPrev) btnPrev.onclick = () => prev(true);

            render();
            start();
          })();
        </script>
      </section>
    `,
    attributes: { class: "gjs-block-custom-slider" },
  },
];
