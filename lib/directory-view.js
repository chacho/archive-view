/** @babel */

import FileView from './file-view'

export default class DirectoryView {
  constructor (parentView, indexInParentView, archivePath, entry) {
    this.entries = []
    this.parentView = parentView
    this.indexInParentView = indexInParentView
    this.element = document.createElement('li')
    this.element.classList.add('list-nested-item', 'entry')

    const listItem = document.createElement('span')
    listItem.classList.add('list-item')

    const entrySpan = document.createElement('span')
    entrySpan.classList.add('directory', 'icon', 'icon-file-directory')
    entrySpan.textContent = entry.getName()
    listItem.appendChild(entrySpan)
    this.element.appendChild(listItem)

    this.entriesTree = document.createElement('ol')
    this.entriesTree.classList.add('list-tree')
    let index = 0
    for (const child of entry.children) {
      if (child.isDirectory()) {
        const entryView = new DirectoryView(this, index, archivePath, child)
        this.entries.push(entryView)
        this.entriesTree.appendChild(entryView.element)
      } else {
        const entryView = new FileView(this, index, archivePath, child)
        this.entries.push(entryView)
        this.entriesTree.appendChild(entryView.element)
      }

      index++
    }
    this.element.appendChild(this.entriesTree)
  }

  destroy () {
    while (this.entries.length > 0) {
      this.entries.pop().destroy()
    }

    this.element.remove()
  }

  selectFileBeforeIndex (index) {
    for (let i = index - 1; i >= 0; i--) {
      const previousEntry = this.entries[i]
      if (previousEntry instanceof FileView) {
        previousEntry.select()
        return
      } else {
        if (previousEntry.selectLastFile()) {
          return
        }
      }
    }

    this.parentView.selectFileBeforeIndex(this.indexInParentView)
  }

  selectFileAfterIndex (index) {
    for (let i = index + 1; i < this.entries.length; i++) {
      const nextEntry = this.entries[i]
      if (nextEntry instanceof FileView) {
        nextEntry.select()
        return
      } else {
        if (nextEntry.selectFirstFile()) {
          return
        }
      }
    }

    this.parentView.selectFileAfterIndex(this.indexInParentView)
  }

  selectFirstFile () {
    for (const entry of this.entries) {
      if (entry instanceof FileView) {
        entry.select()
        return true
      } else {
        if (entry.selectFirstFile()) {
          return true
        }
      }
    }

    return false
  }

  selectLastFile () {
    for (var i = this.entries.length - 1; i >= 0; i--) {
      const entry = this.entries[i]
      if (entry instanceof FileView) {
        entry.select()
        return true
      } else {
        if (entry.selectLastFile()) {
          return true
        }
      }
    }

    return false
  }
}
