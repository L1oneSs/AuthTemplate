import Cookies from "js-cookie";

export enum EnumTokens {
	"ACCESS_TOKEN" = "access_token",
	"REFRESH_TOKEN" = "refresh_token"
}

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);
	return accessToken || null;
};

export const getRefreshToken = () => {
	const refreshToken = Cookies.get(EnumTokens.REFRESH_TOKEN);
	return refreshToken || null;
};

export const saveTokenStorage = (accessToken: string, refreshToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		// domain: process.env.NEXT_PUBLIC_URL,
		expires: 1
	});
	Cookies.set(EnumTokens.REFRESH_TOKEN, refreshToken, {
		// domain: process.env.NEXT_PUBLIC_URL,
		expires: 24 * 30
	});
};

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN);
	Cookies.remove(EnumTokens.REFRESH_TOKEN);
};
