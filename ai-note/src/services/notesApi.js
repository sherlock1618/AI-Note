const API_BASE_URL = 'http://localhost:8000/api';

export const getNoteById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch note');
  return await response.json();
};

export const fetchNotes = async () => {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch notes');
  return await response.json();
};

export const createNote = async (noteData) => {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to create note');
  return await response.json();
};

export const updateNote = async (id, noteData) => {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to update note');
  return await response.json();
};

export const deleteNote = async (id) => {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete note');
  return id;
};

export const fetchDeletedNotes = async () => {
  const response = await fetch(`${API_BASE_URL}/notes/deleted`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch deleted notes');
  return await response.json();
};

export const restoreNote = async (noteId) => {
  const response = await fetch(`${API_BASE_URL}/notes/deleted-notes/${noteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to restore note');
  return await response.json();
};

export const deleteNotePermanently = async (noteId) => {
  const response = await fetch(`${API_BASE_URL}/notes/deleted-notes/${noteId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete note permanently');
  return noteId;
};

export const getSuggestedTitles = async (content) => {
  const response = await fetch(`${API_BASE_URL}/notes/suggested-titles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch suggested titles');
  return await response.json();
}

export const getSummary = async (content) => {
  const response = await fetch(`${API_BASE_URL}/notes/summerize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch summary');
  return await response.json();
}