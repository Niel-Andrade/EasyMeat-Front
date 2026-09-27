// ==========================================================
// EASY MEAT — BannerCard (banner publicitário)
// ==========================================================

import './BannerCard.css';

/**
 * @param {object} props
 * @param {object} props.banner - { id, titulo, imagem, link }
 */
export default function BannerCard({ banner }) {
  if (!banner) return null;

  const { titulo, imagem, link } = banner;

  const Wrapper = link ? 'a' : 'div';
  const wrapperProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper className="banner-card" {...wrapperProps}>
      {imagem ? (
        <img src={imagem} alt={titulo || 'Banner'} className="banner-card__imagem" />
      ) : (
        <div className="banner-card__placeholder">
          <span aria-hidden="true">📢</span>
          <span>{titulo || 'Espaço publicitário'}</span>
        </div>
      )}
      {titulo && imagem && (
        <span className="banner-card__titulo">{titulo}</span>
      )}
    </Wrapper>
  );
}
