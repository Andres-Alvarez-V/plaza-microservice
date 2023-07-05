import { StrategyOptions, ExtractJwt, Strategy } from 'passport-jwt';
import { IJWTPayload } from '../../domain/entities/JWTPayload';

export const initializePassport = () => {
	const opts: StrategyOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET_KEY,
	};

	return new Strategy(opts, async (payload: IJWTPayload, done) => {
		try {
			if (payload.id && payload.role) {
				return done(null, payload);
			}

			return done(null, false);
		} catch (error) {
			done(error, false);
		}
	});
};
