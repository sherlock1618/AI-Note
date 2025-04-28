const mockNotes = [
    {
      id: 1,
      title: 'Welcome to AI Notes',
      content: 'This is your first note. Click to edit me!',
      createdAt: new Date('2023-05-15')
    },
    {
      id: 2,
      title: 'Shopping List',
      content: 'Milk, Eggs, Bread, Fruits, Vegetables',
      createdAt: new Date('2023-05-16')
    },
    {
      id: 3,
      title: 'Project Ideas',
      content: 'Build a note-taking app with AI features\nAdd markdown support\nImplement sharing functionality',
      createdAt: new Date('2023-05-17')
    }
  ];
  
  const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));
  
  export const fetchNotes = async () => {
    await simulateDelay();
    return [...mockNotes]; 
  };
  
  export const createNote = async (noteData) => {
    await simulateDelay();
    const newNote = {
      id: Math.max(...mockNotes.map(note => note.id)) + 1,
      ...noteData,
      createdAt: new Date()
    };
    mockNotes.push(newNote);
    return newNote;
  };
  
  export const updateNote = async (id, noteData) => {
    await simulateDelay();
    const index = mockNotes.findIndex(note => note.id === id);
    if (index !== -1) {
      mockNotes[index] = { ...mockNotes[index], ...noteData };
      return mockNotes[index];
    }
    throw new Error('Note not found');
  };
  
  export const deleteNote = async (id) => {
    await simulateDelay();
    const index = mockNotes.findIndex(note => note.id === id);
    if (index !== -1) {
      mockNotes.splice(index, 1);
      return id;
    }
    throw new Error('Note not found');
  };