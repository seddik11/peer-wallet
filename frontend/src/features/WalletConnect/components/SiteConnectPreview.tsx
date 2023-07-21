interface ISiteConnectPreview {
  icon: string;
  name: string;
  url: string;
  className?: string;
}

export const SiteConnectPreview = (props: ISiteConnectPreview) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${props.className}`}
    >
      {props.icon.length > 0 && "url"}
      {!props.icon.length && "unknown"}
      <span className="mt-5">{props.name}</span>
      <div className="text-base text-fg-on-disabled mt-2.5">{props.url}</div>
    </div>
  );
};
