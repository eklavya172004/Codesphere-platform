import { Button } from "@/components/ui/button";

export default function Home() {
  return (
   <div>
    <p>
      <Button size="xs" variant="primary">
        Primary
      </Button>
      
      <Button variant="secondary">
        Secondary  
      </Button>

      <Button variant="ghost">
        Ghost
      </Button>

      <Button variant="muted">
        Muted
      </Button>

      <Button variant="destructive">
        Destructive
      </Button>
      <Button variant="teritary">
        teritary
      </Button>

      <Button variant="outline">
        Outline
      </Button>
    </p>
   </div>
  );
}
