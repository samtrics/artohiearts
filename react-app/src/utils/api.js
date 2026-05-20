// ============================================================
// Artohie Client API Wrapper
// ============================================================

export const api = {
  getToken: () => localStorage.getItem('artohie_token'),
  setToken: (token) => {
    localStorage.setItem('artohie_token', token);
    window.dispatchEvent(new Event('artohie-auth'));
  },
  clearToken: () => {
    localStorage.removeItem('artohie_token');
    window.dispatchEvent(new Event('artohie-auth'));
  },
  
  getArtist: () => {
    const artist = localStorage.getItem('artohie_artist');
    return artist ? JSON.parse(artist) : null;
  },
  setArtist: (artist) => {
    localStorage.setItem('artohie_artist', JSON.stringify(artist));
    window.dispatchEvent(new Event('artohie-auth'));
  },
  clearArtist: () => {
    localStorage.removeItem('artohie_artist');
    window.dispatchEvent(new Event('artohie-auth'));
  },

  headers: () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = api.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...api.headers(),
        ...options.headers,
      },
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Auth
  async register(data) {
    const res = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) this.setToken(res.token);
    if (res.artist) this.setArtist(res.artist);
    return res;
  },

  async login(data) {
    const res = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) this.setToken(res.token);
    if (res.artist) this.setArtist(res.artist);
    return res;
  },

  logout() {
    this.clearToken();
    this.clearArtist();
  },

  async getMe() {
    return this.request('/api/auth/me');
  },

  // Rankings
  async getRankings({ page = 1, limit = 20, tier = '' } = {}) {
    let query = `?page=${page}&limit=${limit}`;
    if (tier) query += `&tier=${tier}`;
    return this.request(`/api/rankings${query}`);
  },

  async getTrending(limit = 20) {
    return this.request(`/api/rankings/trending?limit=${limit}`);
  },

  async getCategoryRankings(slug, limit = 20) {
    return this.request(`/api/rankings/category/${slug}?limit=${limit}`);
  },

  async getArtistRankingDetails(artistId) {
    return this.request(`/api/rankings/${artistId}`);
  },

  // Artists CRUD
  async getArtists() {
    return this.request('/api/artists');
  },

  async getArtistProfile(id) {
    return this.request(`/api/artists/${id}`);
  },

  async updateArtistProfile(id, data) {
    return this.request(`/api/artists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Artworks
  async getArtworks(category = '') {
    const query = category ? `?category=${category}` : '';
    return this.request(`/api/artworks${query}`);
  },

  async createArtwork(data) {
    return this.request('/api/artworks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Orders
  async createOrder(data) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Commissions
  async createCommission(data) {
    return this.request('/api/commissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCommission(id, data) {
    return this.request(`/api/commissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Feed
  async getFeed() {
    return this.request('/api/feed');
  },

  async likeArtwork(artworkId) {
    return this.request('/api/feed/like', {
      method: 'POST',
      body: JSON.stringify({ artworkId }),
    });
  },
};
