import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaExpand, FaCompress, FaMarkdown } from 'react-icons/fa';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createNote, updateNote, getNoteById, getSuggestedTitles, getSummary } from '../services/notesApi';
import '../styles/NoteEditor.css';
import useTheme from '../hooks/useTheme';

const NoteEditor = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('edit');
  const [suggestedTitles, setSuggestedTitles] = useState([
    'Example Title 1',
    'Example Title 2',
  ]);

  useEffect(() => {
    const loadNote = async () => {
      if (id === 'new' || id === undefined) {
        setNote({ title: '', content: '' });
        setLoading(false);
        return;
      }

      try {
        const data = await getNoteById(id);
        setNote(data);
      } catch (err) {
        setError(`Failed to load note: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!note.title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    try {
      setIsSaving(true);

      if (id === 'new' || id === undefined) {
        await createNote(note);
      } else {
        await updateNote(id, note);
      }

      navigate('/notes');
    } catch (err) {
      setError(`Failed to save note: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSummarize = async () => {
    try{
      const summary = await getSummary(note.content);
      setNote(prev => ({ ...prev, content: summary }));
    } catch (error) {
      setError(`Failed to summarize note: ${error.message}`);
    }
  };

  const handleSuggestTitle = async () => {
    try{
      const titles = await getSuggestedTitles(note.content);
      setSuggestedTitles(titles);
    } catch (error) {
      setError(`Failed to suggest title: ${error.message}`);
    }
  };

  const applySuggestedTitle = (title) => {
    setNote(prev => ({ ...prev, title }));
  };

  if (loading) return (
    <div className={`loading-state ${darkMode ? 'dark' : ''}`}>
      <div className="spinner"></div>
      Loading note...
    </div>
  );

  if (error) return (
    <div className={`error-state ${darkMode ? 'dark' : ''}`}>
      <div className="error-icon">⚠️</div>
      <p>{error}</p>
      <button onClick={() => navigate('/notes')}>Back to Notes</button>
    </div>
  );

  return (
    <div className={`note-editor ${darkMode ? 'dark' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="editor-header">
        <div className="header-left">
          <button 
            className="nav-button"
            onClick={() => navigate('/notes')}
            aria-label="Back to notes"
          >
            <FaArrowLeft />
          </button>
          <button
            className="mode-toggle"
            onClick={toggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <MdLightMode /> : <MdDarkMode />}
          </button>
        </div>

        <div className="header-center">
          <button
            className={`view-mode ${viewMode === 'edit' ? 'active' : ''}`}
            onClick={() => setViewMode('edit')}
          >
            Edit
          </button>
          <button
            className={`view-mode ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => setViewMode('preview')}
          >
            Preview
          </button>
        </div>

        <div className="header-right">
          <button
            className="fullscreen-toggle"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
          <button
            className="save-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            <FaSave /> {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {viewMode === 'edit' ? (
        <>
          <div className="title-with-suggest">
            <input
              type="text"
              name="title"
              value={note.title}
              onChange={handleChange}
              className="note-title-input"
              placeholder="Note Title"
              autoFocus
            />
            <button
              className="action-button"
              onClick={handleSuggestTitle}
              disabled={!note.content.trim()}
            >
              Suggest Title
            </button>
          </div>

          <div className="suggested-titles-scroll">
            {suggestedTitles.map((title, index) => (
              <button
                key={index}
                className="suggested-title-button"
                onClick={() => applySuggestedTitle(title)}
              >
                {title}
              </button>
            ))}
          </div>

          <textarea
            name="content"
            value={note.content}
            onChange={handleChange}
            className="note-content-input"
            placeholder="Write your note here... (Markdown supported)"
          />
        </>
      ) : (
        <div className="markdown-preview">
          <h1>{note.title}</h1>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.content}
          </ReactMarkdown>
        </div>
      )}

      {error && (
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          {error}
        </div>
      )}

      <div className="editor-footer">
        <div className="markdown-hint">
          <FaMarkdown /> Markdown supported
        </div>
        <div className="footer-right">
          <div className="character-count">
            {note.content.length} characters
          </div>
          <button
            className="action-button"
            onClick={handleSummarize}
            disabled={!note.content.trim()}
          >
            Summarize
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;