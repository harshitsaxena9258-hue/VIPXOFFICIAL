import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { cloudStorage } from '../../services/cloudStorage';
import { Icon } from '../common/Icon';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

export const BrowserApp: React.FC = () => {
  const { addNotification } = useOS();
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'tab-1', title: 'Cloud Start', url: 'https://cloudpc.search' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [addressInput, setAddressInput] = useState<string>('https://cloudpc.search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSiteContent, setActiveSiteContent] = useState<any | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const QUICK_BOOKMARKS = [
    { title: 'Google', url: 'https://www.google.com', category: 'Search' },
    { title: 'Wikipedia', url: 'https://en.wikipedia.org', category: 'Knowledge' },
    { title: 'DevDocs', url: 'https://devdocs.io', category: 'Coding' },
    { title: 'GitHub', url: 'https://github.com', category: 'Code' },
    { title: 'TechCrunch', url: 'https://techcrunch.com', category: 'News' },
    { title: 'Reddit', url: 'https://reddit.com', category: 'Community' },
    { title: 'HackerNews', url: 'https://news.ycombinator.com', category: 'Tech' },
    { title: 'YouTube', url: 'https://youtube.com', category: 'Video' },
  ];

  const handleNavigate = (url: string) => {
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('cloudpc://')) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        // Search query
        performCloudSearch(finalUrl);
        return;
      }
    }

    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, url: finalUrl, title: finalUrl.replace(/^https?:\/\//, '') } : t))
    );
    setAddressInput(finalUrl);

    // If external site
    if (finalUrl.includes('wikipedia')) {
      setActiveSiteContent({
        title: 'Wikipedia, the Free Encyclopedia',
        url: finalUrl,
        body: 'Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation. It contains millions of articles across hundreds of languages.',
        subsections: [
          { heading: 'Cloud Computing', content: 'Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.' },
          { heading: 'Virtual Machine', content: 'In computing, a virtual machine (VM) is the virtualization or emulation of a computer system based on computer architectures and provides functionality of a physical computer.' }
        ]
      });
      setSearchResults(null);
    } else if (finalUrl.includes('github')) {
      setActiveSiteContent({
        title: 'GitHub: Let’s build from here',
        url: finalUrl,
        body: 'GitHub is the world’s leading software development and version control platform powered by Git. Millions of developers and companies build, ship, and maintain their software on GitHub.',
        subsections: [
          { heading: 'Trending Repositories', content: 'Explore top open-source projects, web frameworks, Linux kernels, and AI models available for free.' }
        ]
      });
      setSearchResults(null);
    } else if (finalUrl.includes('devdocs')) {
      setActiveSiteContent({
        title: 'DevDocs API Documentation',
        url: finalUrl,
        body: 'DevDocs combines multiple API documentations in a fast, organized, and searchable interface. Includes JavaScript, Python, React, Node.js, HTML5, CSS3, C++, and Go.',
        subsections: [
          { heading: 'JavaScript Standard Library', content: 'Array, Object, Promise, Async/Await, Math, DOM API methods and reference guides.' }
        ]
      });
      setSearchResults(null);
    } else {
      performCloudSearch(finalUrl.replace(/^https?:\/\//, ''));
    }
  };

  const performCloudSearch = (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setActiveSiteContent(null);

    setTimeout(() => {
      setIsSearching(false);
      setSearchResults([
        {
          title: `${query} - Latest Web Overview & Guides`,
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          snippet: `High speed cloud search indexed 1.4B pages in 0.04s. Comprehensive reference, tutorials, documentation, and tools regarding "${query}".`,
        },
        {
          title: `Wikipedia: ${query}`,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
          snippet: `The online encyclopedia article detailing the history, technical specifications, and key developments of ${query}.`,
        },
        {
          title: `GitHub Developers & Community: ${query}`,
          url: `https://github.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Open source code examples, libraries, starter templates, and community discussions around ${query}.`,
        },
        {
          title: `${query} Documentation & Resources`,
          url: `https://devdocs.io/#q=${encodeURIComponent(query)}`,
          snippet: `Official reference manuals, API endpoints, code syntax examples, and interactive playground.`,
        },
      ]);
    }, 280);
  };

  const handleAddTab = () => {
    const newId = 'tab-' + Date.now();
    const newTab: Tab = {
      id: newId,
      title: 'New Tab',
      url: 'https://cloudpc.search',
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setAddressInput('https://cloudpc.search');
    setSearchResults(null);
    setActiveSiteContent(null);
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      setActiveTabId(nextTabs[0].id);
      setAddressInput(nextTabs[0].url);
    }
  };

  const handleSavePageToCloud = () => {
    const filename = `webpage_${Date.now()}.txt`;
    const textToSave = activeSiteContent
      ? `${activeSiteContent.title}\n${activeSiteContent.url}\n\n${activeSiteContent.body}`
      : `Cloud PC Search: ${searchQuery}\n\nSearch Results:\n` +
        searchResults?.map((r) => `${r.title}\n${r.url}\n${r.snippet}\n`).join('\n');

    cloudStorage.createFile(filename, 'folder-downloads', textToSave || 'Web page archive');
    addNotification('Saved to Cloud Drive', `Downloaded "${filename}" directly into Cloud Downloads.`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none text-xs">
      {/* Tab Strip */}
      <div className="flex items-center bg-slate-950 px-2 pt-1 gap-1 border-b border-slate-800 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => {
              setActiveTabId(tab.id);
              setAddressInput(tab.url);
            }}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg max-w-[180px] cursor-pointer transition-colors ${
              tab.id === activeTabId
                ? 'bg-slate-900 text-sky-400 font-medium border-t-2 border-sky-500'
                : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <Icon name="compass" size={13} className="shrink-0" />
            <span className="truncate text-[11px]">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => handleCloseTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <Icon name="close" size={11} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddTab}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded"
          title="New Tab"
        >
          <Icon name="plus" size={14} />
        </button>
      </div>

      {/* Navigation Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-slate-900 border-b border-slate-800">
        <button
          onClick={() => {
            setAddressInput('https://cloudpc.search');
            setSearchResults(null);
            setActiveSiteContent(null);
          }}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300"
          title="Home"
        >
          <Icon name="compass" size={15} />
        </button>
        <button
          onClick={() => handleNavigate(addressInput)}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300"
          title="Refresh"
        >
          <Icon name="refresh" size={15} />
        </button>

        {/* Address Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNavigate(addressInput);
          }}
          className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-full px-3 py-1 focus-within:border-sky-500 transition-colors"
        >
          <Icon name="shield" size={13} className="text-emerald-400 mr-2 shrink-0" />
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Search web or enter address (e.g. wikipedia, techcrunch, google)..."
            className="w-full bg-transparent text-[11px] text-slate-200 focus:outline-none"
          />
          <button type="submit" className="p-1 text-slate-400 hover:text-sky-400">
            <Icon name="search" size={13} />
          </button>
        </form>

        <button
          onClick={handleSavePageToCloud}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[11px] shrink-0"
          title="Download page to Cloud Drive"
        >
          <Icon name="download" size={13} className="text-sky-400" />
          <span className="hidden sm:inline">Save to Cloud</span>
        </button>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto text-[11px]">
        {QUICK_BOOKMARKS.map((bm) => (
          <button
            key={bm.title}
            onClick={() => handleNavigate(bm.url)}
            className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 whitespace-nowrap transition-colors"
          >
            {bm.title}
          </button>
        ))}
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400">Querying 980 Mbps Gigabit Cloud Web Index...</p>
          </div>
        ) : activeSiteContent ? (
          /* Rendered Web Page View */
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">{activeSiteContent.title}</h1>
                <a href={activeSiteContent.url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline text-xs flex items-center gap-1">
                  <span>{activeSiteContent.url}</span>
                  <Icon name="external" size={12} />
                </a>
              </div>
              <button
                onClick={handleSavePageToCloud}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs"
              >
                Save Article
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm">
              {activeSiteContent.body}
            </p>

            {activeSiteContent.subsections?.map((sub: any, idx: number) => (
              <div key={idx} className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 space-y-1.5">
                <h3 className="font-semibold text-sky-300 text-sm">{sub.heading}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{sub.content}</p>
              </div>
            ))}
          </div>
        ) : searchResults ? (
          /* Search Results */
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-slate-400 text-xs pb-2 border-b border-slate-800">
              Showing cloud search results for <strong className="text-white">"{searchQuery}"</strong> (0.03 sec)
            </div>

            {searchResults.map((res, i) => (
              <div
                key={i}
                onClick={() => handleNavigate(res.url)}
                className="p-3.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded-xl cursor-pointer transition-all hover:border-sky-500/50 group"
              >
                <div className="text-[11px] text-slate-500 mb-0.5 truncate">{res.url}</div>
                <h3 className="text-sm font-semibold text-sky-400 group-hover:underline mb-1">
                  {res.title}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">{res.snippet}</p>
              </div>
            ))}
          </div>
        ) : (
          /* Default Cloud Browser Home */
          <div className="max-w-2xl mx-auto text-center py-10 space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Icon name="compass" size={32} className="text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Cloud Edge Browser</h1>
              <p className="text-slate-400 text-xs">
                Ultra-fast 980 Mbps virtual network. Browse, search, and download without using mobile data or phone storage.
              </p>
            </div>

            {/* Quick search input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) performCloudSearch(searchQuery);
              }}
              className="relative max-w-lg mx-auto"
            >
              <input
                type="text"
                placeholder="Search the web with Cloud PC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-full px-5 py-3 pr-12 text-sm text-white focus:outline-none focus:border-sky-500 shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-2 bg-sky-600 hover:bg-sky-500 rounded-full text-white"
              >
                <Icon name="search" size={16} />
              </button>
            </form>

            {/* Grid of Popular Sites */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {QUICK_BOOKMARKS.map((bm) => (
                <button
                  key={bm.title}
                  onClick={() => handleNavigate(bm.url)}
                  className="flex flex-col items-center p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-all hover:scale-105"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-sky-400 font-bold mb-2">
                    {bm.title.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-200 text-xs">{bm.title}</span>
                  <span className="text-[10px] text-slate-500">{bm.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer info bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500">
        <span>Cloud Web Gateway: Isolated Sandbox Active</span>
        <span className="text-emerald-400">Secure 256-bit SSL</span>
      </div>
    </div>
  );
};
