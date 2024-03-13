import classes from './TextLayout.module.css';

export default function TextLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={classes.content}>{children}</div>
  )
}
