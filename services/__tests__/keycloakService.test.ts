import { exchangeCodeForTokens, revokeToken } from '../keycloakService';

global.fetch = jest.fn();

describe('keycloakService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exchangeCodeForTokens', () => {
    it('returns tokens on success', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          access_token: 'test_access_token',
          refresh_token: 'test_refresh_token',
          id_token: 'test_id_token',
        }),
      });

      const tokens = await exchangeCodeForTokens('code', 'redirectUri', 'verifier');

      expect(tokens.accessToken).toBe('test_access_token');
      expect(tokens.refreshToken).toBe('test_refresh_token');
      expect(tokens.idToken).toBe('test_id_token');
    });

    it('throws when access_token is missing', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          error: 'invalid_grant',
          error_description: 'Code not valid',
        }),
      });

      await expect(exchangeCodeForTokens('bad-code', 'redirectUri', 'verifier')).rejects.toThrow(
        'Code not valid'
      );
    });

    it('calls the correct endpoint', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          access_token: 'test_access_token',
          refresh_token: 'test_refresh_token',
        }),
      });

      await exchangeCodeForTokens('code', 'redirectUri', 'verifier');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/protocol/openid-connect/token'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe('revokeToken', () => {
    it('calls the logout endpoint', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({});

      await revokeToken('refresh-token');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/protocol/openid-connect/logout'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
