CREATE TABLE public.gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  emoji text NOT NULL DEFAULT '🎁',
  category text NOT NULL DEFAULT 'Geral',
  sort_order int NOT NULL DEFAULT 0,
  claimed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gifts TO anon, authenticated;
GRANT ALL ON public.gifts TO service_role;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view available gifts" ON public.gifts FOR SELECT TO anon, authenticated USING (claimed = false);

CREATE TABLE public.gift_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id uuid NOT NULL UNIQUE REFERENCES public.gifts(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_contact text NOT NULL,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.gift_claims TO service_role;
ALTER TABLE public.gift_claims ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.claim_gift(_gift_id uuid, _name text, _contact text, _message text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF length(trim(coalesce(_name,''))) < 2 OR length(_name) > 100 THEN RAISE EXCEPTION 'Nome inválido'; END IF;
  IF length(trim(coalesce(_contact,''))) < 5 OR length(_contact) > 120 THEN RAISE EXCEPTION 'Contato inválido'; END IF;
  IF length(coalesce(_message,'')) > 500 THEN RAISE EXCEPTION 'Mensagem muito longa'; END IF;
  UPDATE public.gifts SET claimed = true WHERE id = _gift_id AND claimed = false;
  IF NOT FOUND THEN RETURN false; END IF;
  INSERT INTO public.gift_claims(gift_id, guest_name, guest_contact, message)
  VALUES (_gift_id, trim(_name), trim(_contact), nullif(trim(coalesce(_message,'')),''));
  RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.claim_gift(uuid,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_gift(uuid,text,text,text) TO anon, authenticated;

INSERT INTO public.gifts (name, description, emoji, category, sort_order) VALUES
('Pacote de fraldas RN', 'Porque a princesa vai produzir muito “ouro real”', '👶', 'Fraldas', 1),
('Pacote de fraldas P', 'Ela cresce rápido, igual feitiço de fada', '🧷', 'Fraldas', 2),
('Pacote de fraldas M', 'Para a fase “já mando no castelo”', '🍼', 'Fraldas', 3),
('Lenços umedecidos', 'Varinha mágica de limpeza instantânea', '🧻', 'Higiene', 4),
('Pomada para assaduras', 'Escudo encantado do bumbum real', '🧴', 'Higiene', 5),
('Kit banho (shampoo + sabonete)', 'Perfume de princesa, cheirinho de bebê', '🛁', 'Higiene', 6),
('Toalha com capuz', 'Capa de princesa pós-banho', '🦢', 'Banho', 7),
('Body manga longa (P)', 'Vestido de baile versão soneca', '👗', 'Roupinhas', 8),
('Macacão de algodão (M)', 'Traje oficial para conquistar corações', '🎀', 'Roupinhas', 9),
('Kit meias e luvinhas', 'Sapatinhos de cristal, só que quentinhos', '🧦', 'Roupinhas', 10),
('Manta de tricô', 'Abraço que fica quando a mamãe sai', '🧶', 'Quarto', 11),
('Kit mamadeiras', 'Cálice real do banquete', '🍼', 'Alimentação', 12),
('Babadores', 'Guardanapo de gala da realeza', '🌸', 'Alimentação', 13),
('Mordedor', 'Para quando os dentinhos chegarem com coroa', '💎', 'Brinquedos', 14),
('Móbile para berço', 'Estrelas para sonhar com o reino', '⭐', 'Quarto', 15),
('Livro de pano', 'Primeiro conto de fadas da Selina', '📖', 'Brinquedos', 16);