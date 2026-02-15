import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PrimaryWorkspace = () => {
  return (
    <div className="flex-1 p-system-4 space-y-system-4">
      {/* Component Showcase */}
      <Card className="border border-border shadow-none">
        <CardHeader className="pb-system-2">
          <CardTitle className="text-xl font-serif">Component Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-system-3">
          {/* Buttons */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-system-2">
              Buttons
            </p>
            <div className="flex flex-wrap gap-system-2">
              <Button variant="default">Primary Action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outlined</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="success">Success</Button>
              <Button variant="link">Link Style</Button>
            </div>
          </div>

          {/* Badges */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-system-2">
              Status Badges
            </p>
            <div className="flex flex-wrap gap-system-2">
              <Badge variant="default">Active</Badge>
              <Badge variant="secondary">Draft</Badge>
              <Badge variant="outline">Pending</Badge>
              <Badge variant="destructive">Error</Badge>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-system-2">
              Inputs
            </p>
            <div className="max-w-sm space-y-system-2">
              <Input placeholder="Default input" />
              <Input placeholder="Disabled input" disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography Showcase */}
      <Card className="border border-border shadow-none">
        <CardHeader className="pb-system-2">
          <CardTitle className="text-xl font-serif">Typography Scale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-system-2">
          <h1 className="text-4xl font-serif font-semibold text-foreground">Heading One</h1>
          <h2 className="text-3xl font-serif font-semibold text-foreground">Heading Two</h2>
          <h3 className="text-2xl font-serif font-semibold text-foreground">Heading Three</h3>
          <h4 className="text-xl font-serif font-medium text-foreground">Heading Four</h4>
          <p className="text-base text-foreground max-w-prose">
            Body text at 16px with 1.7 line-height. This paragraph demonstrates the standard reading experience.
            Content should never exceed 720px width for optimal readability.
          </p>
          <p className="text-sm text-muted-foreground">
            Secondary text for metadata, timestamps, and supplementary information.
          </p>
        </CardContent>
      </Card>

      {/* Spacing & Colors */}
      <Card className="border border-border shadow-none">
        <CardHeader className="pb-system-2">
          <CardTitle className="text-xl font-serif">Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-system-2">
            <div className="flex flex-col items-center gap-1">
              <div className="h-12 w-12 rounded-md bg-background border border-border" />
              <span className="text-xs text-muted-foreground">Background</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-12 w-12 rounded-md bg-foreground" />
              <span className="text-xs text-muted-foreground">Foreground</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-12 w-12 rounded-md bg-primary" />
              <span className="text-xs text-muted-foreground">Primary</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-12 w-12 rounded-md bg-muted" />
              <span className="text-xs text-muted-foreground">Muted</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-12 w-12 rounded-md bg-success" />
              <span className="text-xs text-muted-foreground">Success</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-12 w-12 rounded-md bg-warning" />
              <span className="text-xs text-muted-foreground">Warning</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State Example */}
      <Card className="border border-border shadow-none">
        <CardContent className="py-system-5 text-center">
          <p className="text-muted-foreground mb-system-2">No builds yet</p>
          <Button variant="default" size="sm">Start Your First Build</Button>
        </CardContent>
      </Card>

      {/* Error State Example */}
      <Card className="border border-destructive/30 shadow-none">
        <CardContent className="py-system-3">
          <p className="text-sm font-medium text-destructive">Build failed to compile</p>
          <p className="text-sm text-muted-foreground mt-1">
            Check that all imports are correct and dependencies are installed. Run <code className="text-xs bg-muted px-1 py-0.5 rounded">npm install</code> to resolve missing packages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrimaryWorkspace;
