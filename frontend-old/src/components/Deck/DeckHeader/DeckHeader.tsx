import style from './DeckHeader.module.scss';

type DeckHeaderProps = {
  name: string;
  href: string;
  icon?: string;
  alt?: string;
};

function DeckHeader({ name, href, icon, alt }: DeckHeaderProps) {
  return (
    <div className={style.container}>
      <a className={style.link} href={href}>{name}</a>
      <img className={style.icon} src={icon} alt={alt}></img>
    </div>
  );
}

export default DeckHeader;
